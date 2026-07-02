# API REST du backend

## 1. Conventions

- URL locale habituelle : `http://localhost:8090` avec `SERVER_PORT=8090`.
- Format des corps : JSON UTF-8.
- Authentification : `Authorization: Bearer <token>` sauf pour les routes publiques.
- Identifiants : UUID.
- Dates simples : `YYYY-MM-DD`.
- Horodatages : format ISO-8601 produit par Jackson.

Rôles utilisés dans les tableaux :

- **Public** : aucun token nécessaire ;
- **CANDIDAT** : JWT avec `ROLE_CANDIDAT` ;
- **RH** : JWT avec `ROLE_RH`.

## 2. Authentification

| Méthode | Route | Accès | Résultat |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authentifie un RH ou un candidat et retourne un JWT |

Corps de connexion :

```json
{
  "email": "candidat@example.com",
  "motDePasse": "secret123"
}
```

Réponse :

```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "userId": "00000000-0000-0000-0000-000000000000",
  "email": "candidat@example.com",
  "role": "CANDIDAT"
}
```

## 3. Candidats

| Méthode | Route | Accès | En-tête supplémentaire | Description |
|---|---|---|---|---|
| `POST` | `/api/candidats/register` | Public | — | Crée un compte candidat |
| `GET` | `/api/candidats/profil` | CANDIDAT | `X-Candidat-Id` | Retourne le profil désigné |
| `PUT` | `/api/candidats/profil` | CANDIDAT | `X-Candidat-Id` | Remplace les données du profil |
| `PATCH` | `/api/candidats/profil` | CANDIDAT | `X-Candidat-Id` | Modifie les champs fournis |
| `PUT` | `/api/candidats/profil/password` | CANDIDAT | `X-Candidat-Id` | Change le mot de passe |
| `DELETE` | `/api/candidats/profil` | CANDIDAT | `X-Candidat-Id` | Supprime un profil sans demande |

Corps d’inscription :

```json
{
  "nom": "Oueslati",
  "prenom": "Mohamed",
  "email": "mohamed@example.com",
  "motDePasse": "secret123",
  "telephone": "+21600000000",
  "specialite": "Génie logiciel",
  "niveauEtude": "4e année"
}
```

Le corps d’un `PUT /profil` contient les mêmes champs sauf `motDePasse`. Le `PATCH` accepte uniquement les champs à modifier.

Changement de mot de passe :

```json
{
  "oldPassword": "secret123",
  "newPassword": "nouveauSecret123"
}
```

Réponse `CandidatResponse` : `id`, `nom`, `prenom`, `email`, `telephone`, `specialite`, `niveauEtude`, `createdAt`.

## 4. Profil RH

Toutes ces routes exigent le rôle RH et utilisent l’identifiant du principal JWT.

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/rh/profil` | Consulte le profil du RH connecté |
| `PUT` | `/api/rh/profil` | Remplace le profil du RH connecté |
| `PATCH` | `/api/rh/profil` | Modifie les champs fournis |

Corps du remplacement complet :

```json
{
  "nom": "Oueslati",
  "prenom": "Mohamed",
  "email": "rh@example.com",
  "nomAffichage": "RH Admin",
  "contactProfessionnel": "rh@example.com"
}
```

Le `PATCH` accepte le même ensemble de propriétés, toutes optionnelles. La réponse contient également `id` et `createdAt`.

## 5. Offres de stage

| Méthode | Route | Accès | Description |
|---|---|---|---|
| `GET` | `/api/offres` | Public | Liste les offres non expirées |
| `GET` | `/api/offres/{id}` | Public | Retourne une offre par identifiant |
| `POST` | `/api/offres` | RH | Crée une offre pour le RH connecté |
| `PUT` | `/api/offres/{id}` | RH propriétaire | Remplace une offre |
| `PATCH` | `/api/offres/{id}` | RH propriétaire | Modifie les champs fournis |
| `DELETE` | `/api/offres/{id}` | RH propriétaire | Supprime une offre sans demande |

Corps de création ou remplacement :

```json
{
  "referenceOffre": "OFF-2026-001",
  "titre": "Stage développement backend",
  "description": "Développement d’une API Spring Boot",
  "domaine": "Développement logiciel",
  "lieu": "Tunis",
  "duree": "6 mois",
  "dateDebut": "2026-09-01",
  "dateExpiration": "2026-08-15"
}
```

Pour `POST` et `PUT`, tous les champs sont obligatoires. Le `PATCH` accepte un sous-ensemble.

Réponse `OffreStageResponse` : `id`, les huit champs métier ci-dessus, `createdAt`, `rhCreateurId`, `rhCreateurNom`, `rhCreateurEmail`.

## 6. Demandes de stage

### Routes candidat

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/demandes/offre/{offreId}` | Dépose une demande pour l’offre |
| `GET` | `/api/demandes/me` | Liste les demandes du candidat connecté |
| `GET` | `/api/demandes/me/{id}` | Consulte une de ses demandes |
| `DELETE` | `/api/demandes/{id}` | Annule une de ses demandes encore `SOUMISE` |

Corps de création :

```json
{
  "cvUrl": "https://drive.google.com/example-cv",
  "lettreMotivationUrl": "https://drive.google.com/example-letter"
}
```

`cvUrl` est obligatoire, doit être une URL et ne peut pas dépasser 500 caractères. `lettreMotivationUrl` est optionnelle avec les mêmes contraintes de format et de longueur.

### Routes RH

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/demandes` | Liste toutes les demandes |
| `GET` | `/api/demandes/{id}` | Consulte le détail d’une demande |
| `PATCH` | `/api/demandes/{id}/statut` | Change le statut et tente une notification email |
| `PATCH` | `/api/demandes/{id}/commentaire` | Ajoute ou remplace le commentaire RH |
| `PATCH` | `/api/demandes/{id}/note-test` | Ajoute ou remplace la note de test |

Changement de statut :

```json
{
  "statut": "TEST_TECHNIQUE"
}
```

Commentaire :

```json
{
  "commentaireRh": "Profil pertinent pour la suite du processus."
}
```

Note de test :

```json
{
  "noteTestTechnique": 85.5
}
```

Réponse `DemandeResponse` :

- demande : `id`, `referenceDemande`, `dateDemande`, `lettreMotivationUrl`, `cvUrl`, `statut`, `noteTestTechnique`, `commentaireRh`, `updatedAt` ;
- candidat : `candidatId`, `candidatNom`, `candidatPrenom`, `candidatEmail`, `candidatSpecialite`, `candidatNiveauEtude` ;
- offre : `offreStageId`, `referenceOffre`, `offreTitre`, `offreDomaine` ;
- traitement RH : `rhTraitantId`, `rhTraitantNom`, éventuellement nuls.

Les transitions de statut et les règles de note sont détaillées dans [services-metier.md](./services-metier.md).

## 7. Codes HTTP

| Code | Usage |
|---:|---|
| `200 OK` | Lecture ou mise à jour réussie |
| `201 Created` | Inscription, création d’offre ou dépôt de demande réussi |
| `204 No Content` | Suppression ou changement de mot de passe réussi |
| `400 Bad Request` | DTO invalide ou règle métier violée |
| `401 Unauthorized` | Token absent/invalide ou identifiants incorrects |
| `403 Forbidden` | Rôle insuffisant |
| `404 Not Found` | Ressource métier absente |

Exemple d’erreur métier :

```json
{
  "timestamp": "2026-07-02T15:00:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Transition de statut invalide : SOUMISE vers ACCEPTEE"
}
```
