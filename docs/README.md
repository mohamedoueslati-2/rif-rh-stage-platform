# Documentation — RIF RH Stage Platform

Cette documentation décrit l’état réellement implémenté de la plateforme au 2 juillet 2026. Le code Spring Boot du dossier `backend/` constitue la source de vérité.

## Documents

| Document | Contenu |
|---|---|
| [Cahier des charges](./cahier-des-charges.md) | Périmètre fonctionnel livré et critères d’acceptation |
| [Architecture technique](./architecture-technique.md) | Organisation des couches, sécurité et flux principaux |
| [Services métier](./services-metier.md) | Règles métier détaillées par service |
| [API REST](./api-rest.md) | Endpoints, rôles, entrées et réponses |
| [Configuration backend](./configuration-backend.md) | Variables d’environnement, lancement et SMTP |
| [Choix technologiques](./choix-technologiques.md) | Technologies effectivement présentes dans le projet |
| [Schéma de base de données](./schema-base-donnees.md) | Tables et relations issues des entités JPA |
| [Diagramme de classes](./diagramme-classes.md) | Diagramme existant, conservé sans modification |

## Périmètre actuel

Le backend couvre l’inscription et l’authentification, les profils candidat et RH, les offres de stage, les demandes, le workflow de statuts, la note de test, le commentaire RH et les notifications par email SMTP.

Les fonctions suivantes ne font pas partie de l’implémentation actuelle et ne sont donc pas décrites comme disponibles : analyse IA, Firebase/FCM, notifications persistées, sélection groupée de candidats, `mailto` et planification d’une date d’entretien.
