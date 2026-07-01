# Schéma base de données

## Tables

- `personnes`
- `candidats`
- `rh`
- `offres_stage`
- `demandes`

## Relations

```text
candidats.id → personnes.id
rh.id → personnes.id
offres_stage.rh_id → rh.id
demandes.candidat_id → candidats.id
demandes.offre_stage_id → offres_stage.id
demandes.rh_traiteur_id → rh.id
```

## Points importants

- `reference_offre` appartient à `offres_stage`.
- `reference_demande` appartient à `demandes`.
- `cv_url` appartient à `demandes` et il est obligatoire.
- `lettre_motivation_url` appartient à `demandes` et elle est optionnelle.
- Le statut est limité à : `SOUMISE`, `EN_ETUDE`, `TEST_TECHNIQUE`, `ENTRETIEN_FACE_A_FACE`, `ACCEPTEE`, `REFUSEE`.
