# Services métier du backend

## 1. Principes communs

Les contrôleurs obtiennent les paramètres HTTP et délèguent aux services. Les règles métier et les transactions sont portées par les classes de service. Les mappers empêchent l’exposition directe des entités JPA.

Les opérations de lecture sont transactionnelles en lecture seule. Les créations, modifications et suppressions utilisent une transaction d’écriture.

## 2. `AuthService`

Responsabilité : authentifier un utilisateur et produire son jeton d’accès.

Flux :

1. Reçoit un email valide et un mot de passe non vide.
2. Délègue la vérification à `AuthenticationManager`.
3. Recherche le compte par email, d’abord dans les RH puis dans les candidats.
4. Compare le mot de passe avec le hash BCrypt.
5. Génère un JWT HS256 contenant l’email, l’UUID et le rôle.
6. Retourne le token, son type `Bearer`, l’utilisateur et son rôle.

Il n’existe pas de rafraîchissement de token ni de révocation serveur dans l’implémentation actuelle.

## 3. `CandidatServiceImpl`

### Inscription

- Vérifie l’unicité de l’email dans la table parente `personnes`.
- Hash le mot de passe avec BCrypt.
- Mappe et persiste le candidat.
- Ne crée aucune session ; le candidat doit ensuite se connecter.

### Consultation et modification du profil

- Une ressource absente produit `Candidat introuvable` avec HTTP 404.
- `PUT` remplace toutes les données de profil prévues par le DTO.
- `PATCH` ne remplace que les propriétés non nulles.
- Toute modification d’email revérifie son unicité en excluant l’identifiant courant.

### Mot de passe

- L’ancien mot de passe doit correspondre au hash existant.
- Le nouveau mot de passe contient au minimum 6 caractères.
- Le nouveau mot de passe est hashé avant sauvegarde.

### Suppression

- Le profil peut être supprimé uniquement si aucune demande ne référence le candidat.
- Cette protection évite de casser l’historique des candidatures.

### Isolation de l’identité

Le contrôleur récupère `AppUserDetails` depuis le principal JWT et transmet `currentUser.getId()` au service. Le client ne fournit aucun identifiant candidat : il ne peut donc pas cibler le profil d’un autre candidat par un en-tête manipulé.

## 4. `RhServiceImpl`

- Consulte le profil du RH connecté.
- Remplace le profil avec `PUT` ou applique les champs non nuls avec `PATCH`.
- Vérifie l’unicité de l’email dans `personnes`.
- Retourne HTTP 404 si le RH n’existe pas.

La création libre d’un RH n’est pas exposée par l’API. `DataSeeder` crée au démarrage un compte RH initial si aucun compte ne possède l’email configuré.

## 5. `OffreStageServiceImpl`

### Création

- La référence d’offre doit être unique.
- La date de début et la date d’expiration ne peuvent pas être dans le passé.
- La date d’expiration doit être antérieure ou égale à la date de début.
- Le RH connecté devient le créateur de l’offre.

### Lecture

- La liste retourne uniquement les offres dont `dateExpiration >= aujourd’hui`.
- La lecture par UUID charge directement l’offre ; elle ne masque pas une offre expirée.

### Modification

- Seul le RH créateur peut modifier l’offre.
- `PUT` applique un remplacement complet et revérifie la référence et les dates.
- `PATCH` conserve les valeurs existantes pour les champs absents, puis valide la combinaison finale des dates.

### Suppression

- Seul le RH créateur peut supprimer l’offre.
- Toute demande rattachée bloque la suppression, quel que soit son statut.

## 6. `DemandeServiceImpl`

### Dépôt

Le dépôt applique les validations dans cet ordre :

1. absence d’une demande existante pour le couple candidat/offre ;
2. existence du candidat ;
3. existence de l’offre ;
4. date d’expiration non dépassée ;
5. date de début non dépassée.

La référence est générée sous la forme `DEM-<année>-<8 caractères UUID>` et son unicité est vérifiée avant la sauvegarde. `@PrePersist` initialise le statut `SOUMISE`, `dateDemande` et `updatedAt`.

### Isolation des lectures candidat

`getMyDemandes` filtre par candidat. `getMyDemandeById` recherche simultanément l’UUID du candidat et celui de la demande : une demande appartenant à un autre candidat est donc invisible.

### Lecture RH

Le rôle RH peut lister toutes les demandes et consulter chaque détail. Les réponses agrègent les informations utiles du candidat, de l’offre et du RH traitant.

### Commentaire RH

- Le commentaire est obligatoire et non blanc.
- La mise à jour associe également le RH connecté comme `rhTraitant`.

### Note de test

- La note est obligatoire, comprise entre 0 et 100 inclus.
- Elle n’est autorisée qu’aux statuts `TEST_TECHNIQUE` et `ENTRETIEN_FACE_A_FACE`.
- La mise à jour associe le RH connecté comme `rhTraitant`.

### Annulation candidat

- La recherche combine l’identifiant de la demande et celui du candidat connecté.
- Seule une demande `SOUMISE` peut être supprimée.
- Dès qu’un RH a fait progresser la demande, son historique est conservé.

## 7. Machine d’état des demandes

```text
SOUMISE
├── EN_ETUDE
│   ├── TEST_TECHNIQUE
│   │   ├── ENTRETIEN_FACE_A_FACE
│   │   │   ├── ACCEPTEE
│   │   │   └── REFUSEE
│   │   ├── ACCEPTEE
│   │   └── REFUSEE
│   └── REFUSEE
└── REFUSEE
```

Une demande ne passe pas directement de `EN_ETUDE` à l'entretien : elle doit atteindre `TEST_TECHNIQUE`. Elle ne passe pas non plus directement de `SOUMISE` à `ACCEPTEE`. `ACCEPTEE` et `REFUSEE` n’ont aucune sortie. Demander le même statut est toléré comme opération idempotente.

## 8. `NotificationCandidatService`

Ce service reçoit la demande déjà mise à jour et :

1. récupère l’email du candidat ;
2. abandonne silencieusement si l’email est nul ou vide ;
3. sélectionne un sujet et un texte selon le statut ;
4. ignore `SOUMISE` ;
5. délègue l’envoi à `EmailService`.

| Statut | Notification |
|---|---|
| `SOUMISE` | aucune |
| `EN_ETUDE` | demande en cours d’étude |
| `TEST_TECHNIQUE` | test technique à venir |
| `ENTRETIEN_FACE_A_FACE` | prise de contact prochaine pour l’entretien |
| `ACCEPTEE` | acceptation de la demande |
| `REFUSEE` | refus de la demande |

Le texte inclut le nom complet du candidat et le titre de l’offre.

## 9. `EmailService`

`EmailService` construit un `SimpleMailMessage` avec le destinataire, le sujet et le contenu, puis appelle `JavaMailSender.send`.

L’appel est synchrone. `DemandeServiceImpl` l’encadre par un `try/catch` : une panne réseau, une authentification SMTP invalide ou tout autre échec est journalisé en avertissement sans être propagé au contrôleur. La décision RH reste enregistrée.

## 10. Erreurs métier principales

| Domaine | Cas refusé |
|---|---|
| Compte | email déjà utilisé, ancien mot de passe incorrect |
| Candidat | suppression d’un profil ayant des demandes |
| Offre | référence dupliquée, dates incohérentes, RH non propriétaire, suppression avec demandes |
| Demande | doublon candidat/offre, offre expirée, stage commencé, transition invalide, note à une mauvaise étape, annulation après traitement |

Les règles métier lèvent `BadRequestException` (HTTP 400) et les absences de ressources lèvent `ResourceNotFoundException` (HTTP 404).
