# Documentation — RIF RH Stage Platform

Cette documentation décrit l'état implémenté de la plateforme. Le code Spring Boot et Angular constitue la source de vérité.

## Documents

| Document | Contenu |
|---|---|
| [Cahier des charges](./cahier-des-charges.md) | Périmètre fonctionnel et critères d'acceptation |
| [Architecture technique](./architecture-technique.md) | Organisation des couches, sécurité et flux principaux |
| [Services métier](./services-metier.md) | Règles métier détaillées par service |
| [API REST](./api-rest.md) | Endpoints, rôles, entrées et réponses |
| [Configuration backend](./configuration-backend.md) | Variables d'environnement, lancement local et SMTP |
| [Déploiement Docker](./deploiement-docker.md) | Images, Compose, `.env`, volumes, logs et diagnostic |
| [Choix technologiques](./choix-technologiques.md) | Technologies présentes dans le projet |
| [Schéma de base de données](./schema-base-donnees.md) | Tables et relations issues des entités JPA |
| [Diagramme de classes](./diagramme-classes.md) | Modèle objet de l'application |

## Périmètre actuel

La plateforme couvre l'inscription et l'authentification, les profils candidat et RH, les offres de stage, les candidatures, le workflow de statuts, la note de test, le commentaire RH, les dashboards et les notifications par email SMTP.
