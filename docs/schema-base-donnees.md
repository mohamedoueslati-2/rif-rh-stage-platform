# Schéma de base de données

## 1. Source de vérité

Le schéma ci-dessous est dérivé des entités JPA du backend. Avec `JPA_DDL_AUTO=update`, Hibernate crée ou adapte les tables. Le fichier `database/init.sql` est historique et certains noms de colonnes y diffèrent du mapping actuel ; il ne doit pas être utilisé comme description fonctionnelle du modèle courant.

## 2. Tables

### `personnes`

Table parente de l’héritage `JOINED`.

| Colonne | Type logique | Contraintes |
|---|---|---|
| `id` | UUID | clé primaire |
| `nom` | varchar(100) | non nul |
| `prenom` | varchar(100) | non nul |
| `email` | varchar(150) | non nul, unique |
| `mot_de_passe_hash` | varchar | non nul |
| `created_at` | timestamp | non nul, non modifiable |

Le rôle n’est pas stocké dans une colonne de `personnes` : il est déduit de la sous-table `candidats` ou `rh`.

### `candidats`

| Colonne | Type logique | Contraintes |
|---|---|---|
| `id` | UUID | clé primaire et clé étrangère vers `personnes.id` |
| `telephone` | varchar(30) | optionnel |
| `specialite` | varchar(120) | optionnel |
| `niveau_etude` | varchar(120) | optionnel |

### `rh`

| Colonne | Type logique | Contraintes |
|---|---|---|
| `id` | UUID | clé primaire et clé étrangère vers `personnes.id` |
| `nom_affichage` | varchar(120) | optionnel |
| `contact_professionnel` | varchar(150) | optionnel |

### `offres_stage`

| Colonne | Type logique | Contraintes |
|---|---|---|
| `id` | UUID | clé primaire |
| `reference_offre` | varchar(50) | non nul, unique |
| `titre` | varchar | non nul |
| `description` | text | non nul |
| `domaine` | varchar | optionnel au niveau JPA |
| `lieu` | varchar | optionnel au niveau JPA |
| `duree` | varchar | optionnel au niveau JPA |
| `date_debut` | date | optionnel au niveau JPA |
| `date_expiration` | date | optionnel au niveau JPA |
| `created_at` | timestamp | rempli à la création |
| `rh_createur_id` | UUID | non nul, clé étrangère vers `rh.id` |

Les DTO de création et de remplacement complet rendent le domaine, le lieu, la durée et les dates obligatoires, même si les annotations JPA ne les déclarent pas `nullable=false`.

### `demandes`

| Colonne | Type logique | Contraintes |
|---|---|---|
| `id` | UUID | clé primaire |
| `reference_demande` | varchar(50) | non nul, unique |
| `date_demande` | timestamp | rempli à la création |
| `lettre_motivation_url` | varchar(500) | optionnel |
| `cv_url` | varchar(500) | non nul |
| `statut` | varchar/enum | valeur de `StatutDemande` |
| `note_test_technique` | double | optionnel |
| `commentaire_rh` | text | optionnel |
| `updated_at` | timestamp | rempli à la création et à chaque mise à jour |
| `candidat_id` | UUID | non nul, clé étrangère vers `candidats.id` |
| `offre_stage_id` | UUID | non nul, clé étrangère vers `offres_stage.id` |
| `rh_traitant_id` | UUID | optionnel, clé étrangère vers `rh.id` |

Valeurs de statut :

- `SOUMISE` ;
- `EN_ETUDE` ;
- `TEST_TECHNIQUE` ;
- `ENTRETIEN_FACE_A_FACE` ;
- `ACCEPTEE` ;
- `REFUSEE`.

## 3. Relations

```text
personnes 1 ─── 0..1 candidats
personnes 1 ─── 0..1 rh
rh         1 ─── *    offres_stage       via rh_createur_id
candidats  1 ─── *    demandes           via candidat_id
offres_stage 1 ── *    demandes           via offre_stage_id
rh         0..1 ─ *    demandes           via rh_traitant_id
```

## 4. Contraintes métier portées par les services

Certaines règles ne sont pas exprimées par le mapping JPA et sont appliquées dans les services : unicité candidat/offre, intervalle de note 0–100, transitions de statut, cohérence des dates, propriété d’une offre et blocage des suppressions avec dépendances.

Le CV et la lettre de motivation appartiennent à `demandes`, car ils décrivent une candidature précise et non le profil permanent du candidat.
