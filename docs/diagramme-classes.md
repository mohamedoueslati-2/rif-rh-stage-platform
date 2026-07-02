# Diagramme de classes métier

Ce diagramme est dérivé des entités JPA actuellement implémentées.

```mermaid
classDiagram
    class Personne {
        <<abstract>>
        UUID id
        String nom
        String prenom
        String email
        String motDePasseHash
        LocalDateTime createdAt
    }

    class Candidat {
        String telephone
        String specialite
        String niveauEtude
    }

    class RH {
        String nomAffichage
        String contactProfessionnel
    }

    class OffreStage {
        UUID id
        String referenceOffre
        String titre
        String description
        String domaine
        String lieu
        String duree
        LocalDate dateDebut
        LocalDate dateExpiration
        LocalDateTime createdAt
    }

    class Demande {
        UUID id
        String referenceDemande
        LocalDateTime dateDemande
        String cvUrl
        String lettreMotivationUrl
        StatutDemande statut
        Double noteTestTechnique
        String commentaireRh
        LocalDateTime updatedAt
    }

    class StatutDemande {
        <<enumeration>>
        SOUMISE
        EN_ETUDE
        TEST_TECHNIQUE
        ENTRETIEN_FACE_A_FACE
        ACCEPTEE
        REFUSEE
    }

    Personne <|-- Candidat
    Personne <|-- RH
    RH "1" --> "0..*" OffreStage : crée
    Candidat "1" --> "0..*" Demande : dépose
    OffreStage "1" --> "0..*" Demande : reçoit
    RH "0..1" --> "0..*" Demande : traite
    Demande --> StatutDemande
```

## Règles associées

- `Personne` utilise l'héritage JPA `JOINED` avec `Candidat` et `RH`.
- L'email est unique pour tous les types de personne.
- Une offre appartient à un RH créateur.
- Une demande appartient à un candidat et une offre.
- Le RH traitant reste optionnel tant que la demande n'a pas été traitée.
- Le couple candidat/offre est rendu unique par une vérification métier.

L'image historique reste disponible dans [diagramme-classes.png](./diagramme-classes.png), mais le diagramme Mermaid ci-dessus correspond au code actuel.
