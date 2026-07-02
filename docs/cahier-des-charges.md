# Cahier des charges — Plateforme RH RIF Stages

## 1. Contexte et objectif

La plateforme centralise le recrutement de stagiaires. Elle permet à un candidat de gérer son profil, consulter les offres et déposer une candidature. Elle permet au RH de gérer ses offres et de faire progresser les demandes dans un workflow contrôlé.

Le périmètre décrit ici correspond au backend Spring Boot réellement livré.

## 2. Acteurs

### Candidat

Le candidat peut :

- créer un compte et se connecter ;
- consulter et modifier son profil ;
- changer son mot de passe ;
- supprimer son profil tant qu’il ne possède aucune demande ;
- consulter les offres non expirées et le détail d’une offre ;
- déposer au maximum une demande par offre ;
- consulter uniquement ses propres demandes ;
- annuler une demande tant qu’elle est au statut `SOUMISE` ;
- recevoir un email lorsque le RH change effectivement le statut de sa demande.

### Responsable RH

Le RH peut :

- se connecter avec un compte initial créé automatiquement au démarrage ;
- consulter et modifier son profil ;
- créer une offre ;
- modifier totalement ou partiellement une offre dont il est le créateur ;
- supprimer sa propre offre si aucune demande n’y est rattachée ;
- consulter toutes les demandes et leur détail ;
- modifier le statut d’une demande selon les transitions autorisées ;
- ajouter un commentaire RH ;
- attribuer une note de test comprise entre 0 et 100 aux étapes autorisées.

## 3. Authentification et autorisation

- La connexion utilise l’email et le mot de passe.
- Les mots de passe sont stockés sous forme de hash BCrypt.
- Une connexion réussie retourne un JWT de type `Bearer` contenant l’identifiant et le rôle.
- Les rôles applicatifs sont `CANDIDAT` et `RH`.
- L’API est sans session serveur (`STATELESS`).
- L’inscription candidat, la connexion et la lecture des offres sont publiques.
- Les autres opérations sont protégées selon le rôle.

## 4. Gestion des profils

### Profil candidat

Les données gérées sont le nom, le prénom, l’email, le téléphone, la spécialité et le niveau d’étude.

Règles :

- l’email est unique parmi toutes les personnes, candidats et RH confondus ;
- le mot de passe d’inscription contient au moins 6 caractères ;
- un changement de mot de passe exige l’ancien mot de passe correct ;
- un profil candidat lié à une ou plusieurs demandes ne peut pas être supprimé.

### Profil RH

Les données gérées sont le nom, le prénom, l’email, le nom d’affichage et le contact professionnel. L’email reste unique parmi toutes les personnes.

## 5. Gestion des offres

Une offre contient :

- une référence unique ;
- un titre et une description ;
- un domaine, un lieu et une durée ;
- une date de début ;
- une date d’expiration des candidatures ;
- sa date de création ;
- le RH créateur.

Règles :

- les dates de début et d’expiration ne peuvent pas être dans le passé ;
- la date d’expiration doit être antérieure ou égale à la date de début ;
- la liste publique ne retourne que les offres dont la date d’expiration est aujourd’hui ou dans le futur ;
- seul le RH créateur peut modifier ou supprimer l’offre ;
- une offre possédant déjà une demande ne peut pas être supprimée.

## 6. Gestion des demandes

Une demande contient notamment :

- une référence générée au format `DEM-AAAA-XXXXXXXX` ;
- sa date de dépôt et sa date de dernière modification ;
- une URL de CV obligatoire ;
- une URL de lettre de motivation optionnelle ;
- un statut ;
- une note de test optionnelle ;
- un commentaire RH optionnel ;
- le candidat, l’offre et éventuellement le RH traitant.

Règles de dépôt :

- le candidat et l’offre doivent exister ;
- un candidat ne peut déposer qu’une seule demande par offre ;
- le dépôt est refusé si l’offre est expirée ou si le stage a déjà commencé ;
- le statut initial est `SOUMISE`.

## 7. Workflow des statuts

Les statuts sont :

`SOUMISE`, `EN_ETUDE`, `TEST_TECHNIQUE`, `ENTRETIEN_FACE_A_FACE`, `ACCEPTEE`, `REFUSEE`.

Transitions autorisées :

| Depuis | Vers |
|---|---|
| `SOUMISE` | `EN_ETUDE`, `REFUSEE` |
| `EN_ETUDE` | `TEST_TECHNIQUE`, `ENTRETIEN_FACE_A_FACE`, `REFUSEE` |
| `TEST_TECHNIQUE` | `ENTRETIEN_FACE_A_FACE`, `ACCEPTEE`, `REFUSEE` |
| `ENTRETIEN_FACE_A_FACE` | `ACCEPTEE`, `REFUSEE` |
| `ACCEPTEE` | aucune |
| `REFUSEE` | aucune |

La répétition du même statut est acceptée, mais ne déclenche pas de nouvel email. Les statuts `ACCEPTEE` et `REFUSEE` sont finaux.

La note de test est autorisée uniquement lorsque la demande est à l’étape `TEST_TECHNIQUE` ou `ENTRETIEN_FACE_A_FACE`.

## 8. Notifications par email

Lors d’un changement effectif de statut, le backend envoie un email simple au candidat via SMTP et Spring Mail.

Un modèle statique existe pour :

- `EN_ETUDE` ;
- `TEST_TECHNIQUE` ;
- `ENTRETIEN_FACE_A_FACE` ;
- `ACCEPTEE` ;
- `REFUSEE`.

Aucun email n’est envoyé pour `SOUMISE`, pour une adresse absente ou pour une mise à jour qui conserve le même statut. Une panne SMTP est journalisée mais ne doit jamais annuler le changement de statut.

## 9. Contraintes non fonctionnelles

- API REST JSON ;
- accès contrôlé par JWT et rôle ;
- validation des entrées avec Jakarta Validation ;
- persistance transactionnelle avec Spring Data JPA et PostgreSQL ;
- erreurs métier normalisées en HTTP `400` ou `404` ;
- configuration externalisée par variables d’environnement ;
- séparation entre contrôleurs, services, dépôts, entités, DTO et mappers.

## 10. Hors périmètre actuel

Ne sont pas implémentés dans le backend actuel :

- analyse ou notation par intelligence artificielle ;
- Firebase Cloud Messaging ;
- table ou centre de notifications ;
- envoi groupé ou préparation d’emails avec Gmail/`mailto` ;
- téléversement et lecture automatique du contenu d’un CV ;
- stockage d’une date d’entretien ;
- création libre d’un compte RH ;
- pagination et filtrage avancé des listes.

## 11. Critères d’acceptation principaux

1. Un candidat peut s’inscrire, se connecter et gérer son profil.
2. Un RH peut se connecter et gérer uniquement ses propres offres.
3. Une offre expirée n’apparaît pas dans la liste publique.
4. Un candidat authentifié peut déposer une seule demande par offre valide.
5. Un candidat ne peut consulter et annuler que ses propres demandes.
6. Une transition de statut invalide est refusée.
7. Le changement de statut associe le RH traitant et tente l’envoi de l’email attendu.
8. Un échec SMTP n’empêche pas la mise à jour de la demande.
9. Une note hors de l’intervalle 0–100 ou ajoutée à une mauvaise étape est refusée.
10. Les erreurs de validation et les ressources absentes produisent une réponse JSON explicite.
