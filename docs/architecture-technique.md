# Architecture technique

## 1. Vue d’ensemble

La plateforme est un monorepo composé d’un frontend Angular, d’une API Spring Boot et d’une base PostgreSQL.

```text
Navigateur
   |
   | HTTP/JSON + JWT Bearer
   v
Frontend Angular 21
   |
   v
API Spring Boot 4.1 / Java 21
   |                     |
   | JPA/Hibernate       | SMTP
   v                     v
PostgreSQL          Serveur de messagerie
```

Il n’existe actuellement aucune intégration IA, Firebase ou FCM.

## 2. Organisation du dépôt

```text
rif-rh-stage-platform/
├── backend/             API Spring Boot et tests métier
├── frontend/            application Angular/PrimeNG
├── database/            script SQL historique
├── docs/                documentation du projet
├── .env.example         exemple de configuration
└── docker-compose.yml   définition Docker actuellement commentée
```

Les entités JPA et `application.properties` sont les références pour le schéma et la configuration réellement utilisés par le backend.

## 3. Couches du backend

```text
Requête HTTP
    ↓
SecurityFilterChain + JwtAuthenticationFilter
    ↓
Controller
    ↓
Service / ServiceImpl
    ↓
Repository Spring Data JPA
    ↓
PostgreSQL
```

| Package | Responsabilité |
|---|---|
| `controller` | Routage HTTP, validation des corps, principal authentifié et codes de réponse |
| `service` | Contrats métier, authentification, email et notification candidat |
| `service.impl` | Transactions et règles métier des profils, offres et demandes |
| `repository` | Requêtes Spring Data JPA |
| `entity` | Modèle persistant JPA |
| `dto` | Contrats JSON d’entrée et de sortie |
| `mapper` | Conversion entre entités et DTO |
| `security` | utilisateur Spring Security, JWT et filtre Bearer |
| `config` | sécurité HTTP, BCrypt et initialisation du compte RH |
| `exception` | exceptions métier et format des réponses d’erreur |

## 4. Sécurité

Le backend est sans état : aucune session HTTP n’est créée. Le flux est le suivant :

1. `POST /api/auth/login` authentifie l’email et le mot de passe.
2. `AuthService` demande l’authentification à Spring Security.
3. `CustomUserDetailsService` cherche d’abord un RH, puis un candidat par email.
4. `JwtService` signe un JWT HS256 contenant `id`, `role`, le sujet email, les dates d’émission et d’expiration.
5. Le client envoie ensuite `Authorization: Bearer <token>`.
6. `JwtAuthenticationFilter` valide le token et installe `AppUserDetails` dans le contexte de sécurité.
7. `SecurityConfig` et `@PreAuthorize` appliquent les rôles `RH` et `CANDIDAT`.

Routes publiques :

- `POST /api/auth/login` ;
- `POST /api/candidats/register` ;
- `GET /api/offres` et `GET /api/offres/{id}`.

Les routes protégées récupèrent l’utilisateur courant avec `@AuthenticationPrincipal AppUserDetails`. L’identifiant métier provient donc du JWT et ne peut pas être choisi par le client.

## 5. Transactions et persistance

- Les écritures métier utilisent `@Transactional`.
- Les lectures utilisent `@Transactional(readOnly = true)`.
- Les identifiants sont des UUID générés par JPA.
- `Personne` utilise l’héritage JPA `JOINED` avec `Candidat` et `RH`.
- `Demande` et `OffreStage` remplissent automatiquement leurs horodatages avec `@PrePersist` et `@PreUpdate`.
- `spring.jpa.open-in-view=false` impose que les associations nécessaires soient lues et transformées en DTO dans la transaction de service.

## 6. Flux métier principaux

### Dépôt d’une demande

1. Le candidat authentifié appelle `POST /api/demandes/offre/{offreId}`.
2. Le service vérifie l’unicité candidat/offre.
3. Il vérifie l’existence du candidat et de l’offre.
4. Il refuse une offre expirée ou un stage déjà commencé.
5. Il génère la référence de demande, associe le candidat et l’offre, puis persiste au statut `SOUMISE`.

### Changement de statut et email

1. Le RH appelle `PATCH /api/demandes/{id}/statut`.
2. Le service charge la demande et le RH traitant.
3. Il valide la transition depuis l’ancien statut.
4. Il sauvegarde le nouveau statut et le RH traitant.
5. Si le statut a réellement changé, `NotificationCandidatService` choisit le sujet et le contenu.
6. `EmailService` envoie un `SimpleMailMessage` avec `JavaMailSender`.
7. Toute exception d’envoi est interceptée et journalisée ; la réponse métier reste réussie.

## 7. Gestion des erreurs

`GlobalExceptionHandler` retourne un objet JSON contenant `timestamp`, `status`, `error` et `message`.

| Cas | Statut HTTP | Code `error` |
|---|---:|---|
| Ressource inexistante | 404 | `NOT_FOUND` |
| Règle métier violée | 400 | `BAD_REQUEST` |
| DTO invalide | 400 | `VALIDATION_ERROR` |

Les refus d’authentification ou d’autorisation sont gérés par Spring Security.

## 8. Configuration et démarrage

La configuration de la base, du JWT, du CORS, du compte RH initial et de SMTP est injectée par variables d’environnement. Les détails figurent dans [configuration-backend.md](./configuration-backend.md).

Le backend possède un Dockerfile, mais le fichier `docker-compose.yml` actuel ne définit aucun service actif. Le lancement de référence reste Maven local ou la construction directe de l’image backend.

## 9. Références

- [Services métier](./services-metier.md)
- [API REST](./api-rest.md)
- [Schéma de base de données](./schema-base-donnees.md)
- [Diagramme de classes](./diagramme-classes.md), conservé sans modification
