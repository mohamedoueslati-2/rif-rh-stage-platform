# Architecture technique

## 1. Vue d'ensemble

La plateforme est un monorepo composé d'un frontend Angular, d'une API Spring Boot et d'une base PostgreSQL.

```text
Navigateur
   |
   | HTTP :4200
   v
Nginx + Angular 21
   |
   | /api/* + JWT Bearer
   v
Spring Boot 4.1 / Java 21
   |                         |
   | JPA/Hibernate           | SMTP/STARTTLS
   v                         v
PostgreSQL 16          Serveur de messagerie
```

En développement, `ng serve` utilise `proxy.conf.json`. Dans Docker, Nginx sert le bundle Angular, applique le fallback SPA et transmet `/api` au service `backend:8090`.

## 2. Organisation du dépôt

```text
rif-rh-stage-platform/
├── backend/             API, tests métier et image Java 21
├── frontend/            Angular, PrimeNG, Nginx et image Node/Nginx
├── database/            script SQL historique non monté par Compose
├── docs/                documentation technique et soutenance
├── .env.example         modèle commenté des variables
└── docker-compose.yml   PostgreSQL + backend + frontend
```

Les entités JPA et `application.properties` sont les sources de vérité du schéma et de la configuration backend.

## 3. Architecture frontend

Le frontend est organisé par domaine fonctionnel :

| Zone | Responsabilité |
|---|---|
| `core/guards` | protection des routes authentifiées et contrôle des rôles |
| `core/interceptors` | ajout automatique du JWT aux requêtes protégées |
| `layout` | topbar, sidebar contextuelle, thème clair/sombre et structure Sakai |
| `pages/landing` | accueil public, offres filtrables et navigation publique |
| `pages/auth` | connexion, inscription et accès refusé |
| `pages/candidat` | dashboard, offres, candidatures et profil |
| `pages/rh` | dashboard, CRUD offres, traitement des demandes et profil |

Chaque domaine utilise des services Angular injectables pour isoler les appels HTTP. Les modèles TypeScript reflètent les DTO du backend. Les données ne sont pas simulées dans les écrans métier : elles proviennent de `/api`.

### Responsive et ergonomie

- grilles adaptatives avec ruptures à 1100/900/760/700/640 px selon le composant ;
- tableaux PrimeNG scrollables/paginés et cartes repliées sur mobile ;
- formulaires à une colonne sur petit écran ;
- actions principales visibles, états de chargement, listes vides et messages d'erreur ;
- filtres instantanés sans rechargement ;
- thèmes clair et sombre gérés par `LayoutService`.

## 4. Couches du backend

```text
Requête HTTP
    ↓
SecurityFilterChain + JwtAuthenticationFilter
    ↓
Controller + Jakarta Validation
    ↓
Service / ServiceImpl + @Transactional
    ↓
Repository Spring Data JPA
    ↓
PostgreSQL
```

| Package | Responsabilité |
|---|---|
| `controller` | routage HTTP, validation, principal JWT et codes de réponse |
| `service` | contrats métier, authentification, email et notification |
| `service.impl` | transactions et règles des profils, offres et demandes |
| `repository` | accès aux données par requêtes Spring Data paramétrées |
| `entity` | modèle persistant et relations JPA |
| `dto` | contrats JSON et contraintes de surface |
| `mapper` | conversion entité/DTO sans exposer les entités |
| `security` | utilisateur Spring, JWT et filtre Bearer |
| `config` | sécurité HTTP, BCrypt et compte RH initial |
| `exception` | erreurs métier JSON normalisées |

## 5. Sécurité

1. `POST /api/auth/login` reçoit un email et un mot de passe validés.
2. Spring Security compare le mot de passe avec le hash BCrypt.
3. `JwtService` signe un JWT HS256 contenant l'UUID, le rôle, l'email et l'expiration.
4. Le frontend conserve la session et l'intercepteur ajoute `Authorization: Bearer <token>`.
5. `JwtAuthenticationFilter` vérifie la signature et l'expiration à chaque requête.
6. `SecurityConfig`, `@PreAuthorize` et les guards Angular séparent les rôles `RH` et `CANDIDAT`.
7. L'identité métier vient de `@AuthenticationPrincipal`, jamais d'un identifiant candidat fourni par le client.

Routes publiques :

- `POST /api/auth/login` ;
- `POST /api/candidats/register` ;
- `GET /api/offres` et `GET /api/offres/{id}`.

Protections supplémentaires :

- API sans session (`STATELESS`) ;
- CORS limité aux origines configurées ;
- validation Jakarta des emails, champs obligatoires, URLs, tailles et nombres ;
- contrôles frontend pour un retour immédiat, puis revalidation obligatoire côté serveur ;
- secrets externalisés dans `.env`, ignoré par Git ;
- repositories JPA paramétrés, sans concaténation SQL utilisateur ;
- propriété vérifiée avant modification/suppression d'une offre ;
- lecture candidat limitée à ses propres demandes.

## 6. Persistance et règles métier

- écritures avec `@Transactional`, lectures avec `@Transactional(readOnly = true)` ;
- UUID générés par JPA ;
- héritage `JOINED` entre `Personne`, `Candidat` et `RH` ;
- horodatages via `@PrePersist` et `@PreUpdate` ;
- `spring.jpa.open-in-view=false` ;
- `JPA_DDL_AUTO=update` pour préserver les données ;
- volume Docker `postgres_data` persistant.

### Workflow de demande

```text
SOUMISE
  ├─ REFUSEE
  └─ EN_ETUDE
       ├─ REFUSEE
       └─ TEST_TECHNIQUE
            ├─ REFUSEE
            ├─ ACCEPTEE
            └─ ENTRETIEN_FACE_A_FACE
                 ├─ ACCEPTEE
                 └─ REFUSEE
```

Le passage `EN_ETUDE → ENTRETIEN_FACE_A_FACE` est interdit. La note technique est acceptée seulement pendant `TEST_TECHNIQUE` ou `ENTRETIEN_FACE_A_FACE`.

## 7. Automatisation

Lors d'un changement réel de statut :

1. la transition est validée ;
2. le nouveau statut et le RH traitant sont persistés ;
3. `NotificationCandidatService` choisit un sujet et un message ;
4. `EmailService` envoie le message par SMTP ;
5. une panne SMTP est journalisée sans annuler la décision RH.

Cette stratégie garantit la cohérence métier : la persistance reste prioritaire sur un service externe temporairement indisponible.

## 8. Docker et exploitation

`docker-compose.yml` définit trois services avec healthchecks et dépendances conditionnelles :

- PostgreSQL doit être sain avant Spring Boot ;
- Spring Boot doit répondre sur `/api/offres` avant Nginx ;
- Nginx doit répondre sur `/health`.

Les images sont multi-stage : Maven/Java pour le backend, Node/Nginx pour le frontend. Les conteneurs ont été validés ensemble avec le frontend sur `4200`, l'API sur `8090` et PostgreSQL Docker sur un port hôte configurable.

Voir [Déploiement Docker](./deploiement-docker.md).

## 9. Tests et qualité

Le backend possède 53 tests unitaires JUnit/Mockito répartis entre candidats, RH, offres et demandes. Ils couvrent les cas nominaux et négatifs : doublons, dates, propriété, suppressions protégées, transitions, notes et panne SMTP.

Commandes de contrôle :

```bash
cd backend && ./mvnw test
cd frontend && npm run build
docker compose config
```

