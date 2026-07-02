# Déploiement avec Docker Compose

## Architecture

Docker Compose crée trois services sur le réseau privé `rif-network` :

| Service | Image | Port interne | Port hôte par défaut |
|---|---|---:|---:|
| `postgres` | PostgreSQL 16 Alpine | 5432 | `DB_PORT=5432` |
| `backend` | Java 21 | 8090 | `SERVER_PORT=8090` |
| `frontend` | Nginx Alpine | 80 | `FRONTEND_PORT=4200` |

Le navigateur contacte Nginx. Les requêtes `/api/*` sont transmises à `backend:8090`. Le backend contacte la base avec `postgres:5432`.

## Préparer `.env`

Docker Compose lit automatiquement le fichier `.env` situé à côté de `docker-compose.yml`.

```bash
cp .env.example .env
```

Variables principales :

| Variable | Utilisation Docker |
|---|---|
| `FRONTEND_PORT` | Port public de l'application |
| `SERVER_PORT` | Port public de l'API |
| `DB_NAME` | Base PostgreSQL créée au premier lancement |
| `DB_PORT` | Port PostgreSQL exposé sur la machine |
| `DB_USERNAME` / `DB_PASSWORD` | Identifiants PostgreSQL et backend |
| `JWT_SECRET` | Signature des tokens JWT |
| `SEED_RH_EMAIL` / `SEED_RH_PASSWORD` | Création du premier compte RH |
| `CORS_ALLOWED_ORIGINS` | Origines frontend autorisées |
| `MAIL_*` | Serveur SMTP des notifications |

Dans le conteneur backend, Compose remplace `DB_URL` par `jdbc:postgresql://postgres:5432/${DB_NAME}`. La valeur utilisant `localhost` reste adaptée au lancement sans Docker.

## Valider et démarrer

```bash
docker compose config
docker compose up --build -d
docker compose ps
```

La sortie de `docker compose config` contient les valeurs résolues : ne pas la partager si elle affiche des secrets.

Au premier build, Maven et npm téléchargent les dépendances. Pour observer le démarrage :

```bash
docker compose logs -f postgres backend frontend
```

Quand les trois services sont `healthy`, ouvrir `http://localhost:4200`.

## Reconstruire après une modification

```bash
# Toute la plateforme
docker compose up --build -d

# Frontend uniquement
docker compose up --build -d frontend

# Backend uniquement
docker compose up --build -d backend
```

## Données PostgreSQL

Le volume nommé `postgres_data` conserve la base après `docker compose down`.

Sauvegarder la base :

```bash
docker compose exec postgres pg_dump -U postgres -d rif_rh_stage_db > backup.sql
```

Adapter la commande si `DB_USERNAME` ou `DB_NAME` a été modifié.

Réinitialiser complètement la base :

```bash
docker compose down -v
docker compose up --build -d
```

La première commande détruit définitivement les données du volume.

## Commandes utiles

```bash
docker compose ps
docker compose logs -f backend
docker compose restart backend
docker compose exec postgres psql -U postgres -d rif_rh_stage_db
docker compose down
```

## Problèmes fréquents

### Port déjà utilisé

Modifier le port concerné dans `.env` :

```env
FRONTEND_PORT=4300
DB_PORT=5433
```

`SERVER_PORT` doit rester `8090` avec la configuration Nginx actuelle. Si son port interne change, mettre également à jour `frontend/nginx.conf`.

### Backend `unhealthy`

```bash
docker compose logs backend
docker compose logs postgres
```

Vérifier `DB_PASSWORD`, `JWT_SECRET` et la disponibilité de PostgreSQL.

### Emails non envoyés

Pour Gmail, utiliser un mot de passe d'application dans `MAIL_PASSWORD`. Un échec SMTP ne doit pas annuler une mise à jour de statut.
