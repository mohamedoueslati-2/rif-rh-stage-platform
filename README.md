# RIF RH Stage Platform

Plateforme de gestion des offres et candidatures de stage destinée aux candidats et au service RH du RIF.

## Technologies

- Angular 21, PrimeNG et Chart.js ;
- Spring Boot 4, Java 21, Spring Security et JWT ;
- PostgreSQL 16 ;
- Nginx pour publier le frontend et transmettre `/api` au backend ;
- Docker Compose pour lancer l'ensemble de la plateforme.

## Démarrage rapide avec Docker

### 1. Préparer les variables

Depuis la racine du projet :

```powershell
Copy-Item .env.example .env
```

Sous Linux ou macOS :

```bash
cp .env.example .env
```

Modifier ensuite `.env` et remplacer au minimum :

- `JWT_SECRET` par une longue valeur aléatoire ;
- `DB_PASSWORD` par un mot de passe PostgreSQL ;
- `SEED_RH_EMAIL` et `SEED_RH_PASSWORD` par le compte RH initial ;
- `MAIL_USERNAME` et `MAIL_PASSWORD` si les emails doivent être envoyés.

Le fichier `.env` est ignoré par Git. Ne jamais y placer un secret destiné à être publié.

### 2. Construire et démarrer

```bash
docker compose up --build -d
```

Docker démarre dans l'ordre : PostgreSQL, backend, puis frontend après validation des healthchecks.

### 3. Ouvrir l'application

- Frontend : [http://localhost:4200](http://localhost:4200)
- API backend : [http://localhost:8090/api/offres](http://localhost:8090/api/offres)
- PostgreSQL : `localhost:5432`

Les ports peuvent être changés avec `FRONTEND_PORT`, `SERVER_PORT` et `DB_PORT` dans `.env`.

### 4. Vérifier les conteneurs et les logs

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

### 5. Arrêter sans supprimer les données

```bash
docker compose down
```

Les données PostgreSQL restent dans le volume Docker `postgres_data`.

Pour supprimer volontairement les conteneurs **et toutes les données** :

```bash
docker compose down -v
```

## Lancement local sans Docker

Prérequis : Java 21, Node.js 22 et PostgreSQL.

1. Copier `.env.example` vers `.env` et conserver une `DB_URL` utilisant `localhost`.
2. Démarrer le backend depuis `backend` :

```powershell
.\mvnw.cmd spring-boot:run
```

3. Démarrer Angular depuis `frontend` :

```bash
npm ci
npm start
```

Le serveur Angular transmet `/api` vers `http://localhost:8090` grâce à `proxy.conf.json`.

## Structure utile

```text
backend/              API Spring Boot et Dockerfile Java
frontend/             Application Angular, Nginx et Dockerfile frontend
database/             Script SQL historique, non exécuté automatiquement
docs/                 Documentation fonctionnelle et technique
docker-compose.yml    Orchestration PostgreSQL + backend + frontend
.env.example          Modèle commenté des variables
```

Le fichier `database/init.sql` contient des commandes `DROP TABLE`. Il n'est volontairement pas monté par Docker Compose : Hibernate utilise `JPA_DDL_AUTO=update` afin de conserver les données.

Pour le guide détaillé, consulter [Déploiement Docker](docs/deploiement-docker.md).
