# Configuration du backend Spring Boot

## 1. Prérequis

- JDK 21 ;
- PostgreSQL accessible ;
- un serveur SMTP si les notifications email doivent être réellement envoyées ;
- aucune installation globale de Maven nécessaire grâce à `mvnw.cmd`/`mvnw`.

## 2. Variables d’environnement

`application.properties` attend les variables suivantes :

| Variable | Obligatoire | Exemple local | Rôle |
|---|---|---|---|
| `SERVER_PORT` | oui | `8090` | Port HTTP |
| `DB_URL` | oui | `jdbc:postgresql://localhost:5432/rif_rh_stage_db` | URL JDBC |
| `DB_USERNAME` | oui | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | oui | `change_me` | Mot de passe PostgreSQL |
| `JPA_DDL_AUTO` | oui | `update` | Stratégie Hibernate DDL |
| `JPA_SHOW_SQL` | oui | `true` | Affichage SQL |
| `APP_TIMEZONE` | oui | `Africa/Tunis` | Fuseau Jackson |
| `JWT_SECRET` | oui | secret aléatoire d’au moins 32 octets | Signature HS256 |
| `JWT_EXPIRATION_MS` | oui | `86400000` | Durée du token en millisecondes |
| `CORS_ALLOWED_ORIGINS` | oui | `http://localhost:4200` | Origines CORS, séparées par des virgules |
| `SEED_RH_EMAIL` | oui | `rh@example.com` | Email du RH initial |
| `SEED_RH_PASSWORD` | oui | valeur secrète | Mot de passe initial du RH |
| `MAIL_HOST` | non | `smtp.gmail.com` | Hôte SMTP, valeur par défaut identique |
| `MAIL_PORT` | non | `587` | Port SMTP, valeur par défaut identique |
| `MAIL_USERNAME` | non au démarrage | `sender@example.com` | Compte SMTP |
| `MAIL_PASSWORD` | non au démarrage | mot de passe d’application | Secret SMTP |

`MAIL_USERNAME` et `MAIL_PASSWORD` possèdent une valeur vide par défaut, mais l’envoi échouera si le fournisseur SMTP exige une authentification. Cet échec ne bloque pas les changements de statut.

## 3. Fichier `.env`

Le dépôt contient `.env.example` comme aide de configuration. Le backend lit les variables du processus via Spring. La simple présence d’un fichier `.env` ne garantit pas son chargement automatique : il faut les injecter avec l’IDE, le terminal, Docker ou un mécanisme de lancement adapté.

Ne jamais committer un vrai `JWT_SECRET`, un mot de passe PostgreSQL, le mot de passe RH ou le mot de passe d’application SMTP.

Exemple PowerShell minimal avant lancement :

```powershell
$env:SERVER_PORT='8090'
$env:DB_URL='jdbc:postgresql://localhost:5432/rif_rh_stage_db'
$env:DB_USERNAME='postgres'
$env:DB_PASSWORD='change_me'
$env:JPA_DDL_AUTO='update'
$env:JPA_SHOW_SQL='true'
$env:APP_TIMEZONE='Africa/Tunis'
$env:JWT_SECRET='remplacer-par-un-secret-long-et-aleatoire'
$env:JWT_EXPIRATION_MS='86400000'
$env:CORS_ALLOWED_ORIGINS='http://localhost:4200'
$env:SEED_RH_EMAIL='rh@example.com'
$env:SEED_RH_PASSWORD='remplacer-ce-mot-de-passe'
$env:MAIL_HOST='smtp.gmail.com'
$env:MAIL_PORT='587'
$env:MAIL_USERNAME='sender@example.com'
$env:MAIL_PASSWORD='mot-de-passe-application'
```

## 4. Configuration SMTP

Le backend configure :

- encodage UTF-8 ;
- authentification SMTP ;
- STARTTLS ;
- port 587 par défaut.

Pour Gmail, `MAIL_PASSWORD` doit être un mot de passe d’application et non le mot de passe principal du compte. Un autre fournisseur SMTP peut être utilisé en changeant l’hôte, le port et les identifiants.

## 5. Lancement

Depuis le dossier `backend` sous Windows :

```powershell
.\mvnw.cmd spring-boot:run
```

Sous Linux ou macOS :

```bash
./mvnw spring-boot:run
```

Compilation sans démarrage :

```powershell
.\mvnw.cmd clean package
```

Tests :

```powershell
.\mvnw.cmd test
```

## 6. Initialisation du RH

Au démarrage, `DataSeeder` recherche `SEED_RH_EMAIL` dans toutes les personnes. Si cet email n’existe pas, il crée un RH avec :

- nom `Oueslati` ;
- prénom `Mohamed` ;
- nom d’affichage `RH Admin` ;
- email et contact professionnel égaux à `SEED_RH_EMAIL` ;
- mot de passe BCrypt dérivé de `SEED_RH_PASSWORD`.

Changer ultérieurement les variables ne modifie pas automatiquement un compte déjà créé.

## 7. CORS

`CORS_ALLOWED_ORIGINS` accepte plusieurs origines séparées par des virgules. Les méthodes autorisées sont `GET`, `POST`, `PUT`, `PATCH`, `DELETE` et `OPTIONS`. Les en-têtes autorisés sont `Authorization` et `Content-Type`, avec credentials activés.
