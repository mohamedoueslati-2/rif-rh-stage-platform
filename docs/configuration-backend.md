# Configuration du backend Spring Boot

## Prérequis locaux

- JDK 21 ;
- PostgreSQL ;
- un serveur SMTP pour les notifications réelles ;
- Maven n'est pas requis globalement grâce à `mvnw` et `mvnw.cmd`.

## Variables d'environnement

Le modèle complet et commenté se trouve dans `.env.example` à la racine.

| Variable | Exemple | Rôle |
|---|---|---|
| `SERVER_PORT` | `8090` | Port HTTP du backend |
| `DB_URL` | `jdbc:postgresql://localhost:5432/rif_rh_stage_db` | URL JDBC locale |
| `DB_NAME` | `rif_rh_stage_db` | Nom utilisé par Docker Compose |
| `DB_PORT` | `5432` | Port PostgreSQL exposé par Docker |
| `DB_USERNAME` | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | valeur secrète | Mot de passe PostgreSQL |
| `JPA_DDL_AUTO` | `update` | Stratégie Hibernate DDL |
| `JPA_SHOW_SQL` | `true` | Affichage des requêtes SQL |
| `APP_TIMEZONE` | `Africa/Tunis` | Fuseau horaire applicatif |
| `JWT_SECRET` | secret aléatoire long | Signature des JWT |
| `JWT_EXPIRATION_MS` | `86400000` | Durée du token en millisecondes |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:4200` | Origines autorisées, séparées par des virgules |
| `SEED_RH_EMAIL` | `rh@example.com` | Email du compte RH initial |
| `SEED_RH_PASSWORD` | valeur secrète | Mot de passe RH initial |
| `MAIL_HOST` | `smtp.gmail.com` | Hôte SMTP |
| `MAIL_PORT` | `587` | Port SMTP STARTTLS |
| `MAIL_USERNAME` | `sender@example.com` | Compte SMTP |
| `MAIL_PASSWORD` | mot de passe d'application | Secret SMTP |

## Chargement de `.env`

Créer le fichier depuis la racine :

```powershell
Copy-Item .env.example .env
```

Lorsque Spring Boot est lancé depuis `backend`, `RhStageBackendApplication` charge automatiquement `../.env`. Docker Compose transmet également ce fichier au conteneur avec `env_file`.

Dans Docker, `DB_URL` est remplacée par une URL utilisant le service `postgres`. En local, elle continue d'utiliser `localhost`.

Ne jamais committer un vrai `JWT_SECRET`, un mot de passe PostgreSQL, le mot de passe RH ou le secret SMTP.

## Lancement local

Depuis `backend` sous Windows :

```powershell
.\mvnw.cmd spring-boot:run
```

Sous Linux ou macOS :

```bash
./mvnw spring-boot:run
```

Compilation et tests :

```powershell
.\mvnw.cmd clean package
.\mvnw.cmd test
```

## Configuration SMTP

Le backend utilise UTF-8, l'authentification SMTP et STARTTLS. Pour Gmail, `MAIL_PASSWORD` doit être un mot de passe d'application, pas le mot de passe principal.

Si SMTP échoue, la mise à jour du statut reste enregistrée et un avertissement est écrit dans les logs.

## Initialisation du RH

Au démarrage, le seeder recherche `SEED_RH_EMAIL`. Si cet email n'existe pas, il crée le premier compte RH avec le mot de passe chiffré issu de `SEED_RH_PASSWORD`.

Modifier ces variables ne change pas automatiquement un compte déjà présent en base.

## Conservation des données

Utiliser :

```env
JPA_DDL_AUTO=update
```

Ne pas utiliser `create-drop` avec des données importantes : les tables seraient supprimées à l'arrêt de l'application.

## CORS

`CORS_ALLOWED_ORIGINS` accepte plusieurs origines séparées par des virgules. Pour la configuration Docker par défaut :

```env
CORS_ALLOWED_ORIGINS=http://localhost:4200,http://localhost:5173
```
