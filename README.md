# RIF RH Stage Platform

Structure initiale du projet mise à jour avec documentation fonctionnelle, choix technologiques et architecture technique.

## Structure

```text
rif-rh-stage-platform/
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── database/
│   └── init.sql
├── docs/
│   ├── cahier-des-charges.md
│   ├── choix-technologiques.md
│   ├── architecture-technique.md
│   ├── diagramme-classes.md
│   ├── diagramme-classes.png
│   └── schema-base-donnees.md
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

## Choix principaux

| Partie | Technologie |
|---|---|
| Frontend | Angular + PrimeNG Sakai |
| Backend | Spring Boot |
| Base de données | PostgreSQL |
| Sécurité | Spring Security + JWT |
| IA | Gemini / Vertex AI ou Groq |
| Notification | Firebase FCM |
| Email | Gmail / mailto |
| Déploiement | Docker + Docker Compose |

## Remarque

Pour le moment, `frontend/` et `backend/` sont vides et contiennent seulement un `Dockerfile` avec des commentaires placeholder.

Le `docker-compose.yml` lance seulement PostgreSQL.
Les services `backend` et `frontend` sont commentés jusqu’à l’ajout du code et du contenu réel des Dockerfiles.

## Démarrage PostgreSQL

```bash
cp .env.example .env
docker compose up -d postgres
```

## Git

```bash
git init
git add .
git commit -m "init: setup project documentation and architecture"
```
