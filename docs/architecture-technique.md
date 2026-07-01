# Architecture technique

## 1. Type d’architecture

Le projet utilise une architecture simple en couches, adaptée à un MVP de 2 jours.

L’objectif est de séparer clairement :

- l’interface utilisateur ;
- la logique métier ;
- l’accès aux données ;
- les services externes.

---

## 2. Vue globale

```text
Utilisateur
    |
    v
Frontend Angular
    |
    v
API REST Spring Boot
    |
    v
PostgreSQL
```

Services externes :

```text
Spring Boot
    |
    +--> API IA : Gemini / Groq
    |
    +--> Firebase FCM
    |
    +--> Gmail / mailto
```

---

## 3. Architecture applicative

```text
rif-rh-stage-platform/
├── frontend/
│   └── Application Angular
│
├── backend/
│   └── API REST Spring Boot
│
├── database/
│   └── Script SQL PostgreSQL
│
├── docs/
│   └── Documentation technique et fonctionnelle
│
└── docker-compose.yml
```

---

## 4. Architecture backend

Le backend Spring Boot peut être organisé comme suit :

```text
backend/
└── src/main/java/
    └── com/rif/rhstage/
        ├── controller/
        ├── service/
        ├── repository/
        ├── entity/
        ├── dto/
        ├── mapper/
        ├── security/
        └── config/
```

### Rôle des couches

| Couche | Rôle |
|---|---|
| Controller | Expose les endpoints REST |
| Service | Contient la logique métier |
| Repository | Accès à la base de données |
| Entity | Représente les tables |
| DTO | Transporte les données entre frontend et backend |
| Mapper | Convertit Entity vers DTO |
| Security | Gestion JWT et rôles |
| Config | Configuration globale |

---

## 5. Architecture frontend

Le frontend Angular peut être organisé comme suit :

```text
frontend/
└── src/app/
    ├── core/
    ├── shared/
    ├── features/
    │   ├── auth/
    │   ├── candidat/
    │   ├── rh/
    │   ├── offres/
    │   └── demandes/
    └── layout/
```

### Rôle des dossiers

| Dossier | Rôle |
|---|---|
| core | Services globaux, guards, interceptors |
| shared | Composants réutilisables |
| features/auth | Connexion et inscription |
| features/candidat | Espace candidat |
| features/rh | Espace RH |
| features/offres | Gestion des offres |
| features/demandes | Gestion des demandes |
| layout | Menu, sidebar, header |

---

## 6. Communication frontend / backend

Le frontend communique avec le backend via des API REST.

Exemples :

```text
GET    /api/offres
POST   /api/demandes
PATCH  /api/demandes/{id}/statut
POST   /api/demandes/{id}/analyse-ia
```

---

## 7. Architecture base de données

Les tables principales sont :

- personnes ;
- candidats ;
- rh ;
- offres_stage ;
- demandes.

Relations principales :

```text
Personne 1 --- 1 Candidat
Personne 1 --- 1 RH
RH 1 --- * OffreStage
Candidat 1 --- * Demande
OffreStage 1 --- * Demande
RH 0..1 --- * Demande
```

---

## 8. Workflow technique principal

```text
1. Le candidat consulte les offres depuis Angular.
2. Angular appelle l’API Spring Boot.
3. Spring Boot lit les offres depuis PostgreSQL.
4. Le candidat dépose une demande avec cvUrl.
5. Spring Boot valide les données.
6. La demande est enregistrée dans PostgreSQL.
7. Le RH consulte les demandes.
8. Le RH lance l’analyse IA.
9. Spring Boot appelle l’API IA.
10. Le score et le commentaire sont enregistrés.
11. Le RH change le statut.
12. Spring Boot déclenche FCM si nécessaire.
13. Le RH peut ouvrir Gmail avec un email prérempli.
```

---

## 9. Architecture Docker prévue

Pour le moment, seuls les dossiers et les Dockerfiles vides sont préparés.

Architecture cible :

```text
docker-compose.yml
    |
    +--> postgres
    +--> backend
    +--> frontend
```

Images prévues :

| Service | Image |
|---|---|
| frontend | Image Angular buildée avec Nginx |
| backend | Image Spring Boot |
| postgres | Image officielle PostgreSQL |

La base PostgreSQL n’a pas besoin de Dockerfile, car elle utilise l’image officielle `postgres`.

---

## 10. Résumé

Cette architecture est simple, claire et adaptée au MVP.

Elle permet :

- un développement rapide ;
- une séparation claire frontend/backend/database ;
- un déploiement facile avec Docker Compose ;
- une évolution future vers une architecture plus avancée si nécessaire.
