# Choix technologiques

## 1. Objectif

Cette section présente les technologies retenues pour développer le MVP de la plateforme RH RIF Stages.

Le choix est orienté vers une solution simple, rapide à développer, facile à démontrer et facilement déployable.

---

## 2. Frontend

### Technologie choisie

- Angular
- PrimeNG
- Template Sakai

### Justification

Angular est choisi parce qu’il permet de créer une application web structurée, modulaire et maintenable.

PrimeNG et Sakai permettent de gagner du temps sur l’interface grâce à des composants prêts à l’emploi : tableaux, formulaires, boutons, dashboard, filtres et menus.

### Utilisation dans le projet

Le frontend contient deux espaces principaux :

- espace candidat ;
- espace RH.

L’application doit être responsive pour fonctionner sur mobile, tablette et web.

---

## 3. Backend

### Technologie choisie

- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security

### Justification

Spring Boot est choisi pour créer rapidement une API REST robuste.

Il permet de gérer :

- les comptes ;
- les offres de stage ;
- les demandes ;
- les statuts ;
- l’intégration IA ;
- les notifications ;
- la sécurité.

Spring Data JPA facilite la communication avec PostgreSQL.

Spring Security permet de sécuriser les accès selon les rôles : Candidat et RH.

---

## 4. Base de données

### Technologie choisie

- PostgreSQL

### Justification

PostgreSQL est choisi car il est fiable, gratuit, open source et adapté aux applications web professionnelles.

Il permet de stocker clairement les données relationnelles :

- candidats ;
- RH ;
- offres ;
- demandes ;
- statuts ;
- commentaires ;
- scores.

---

## 5. Intelligence artificielle

### Technologies possibles

- Gemini / Vertex AI
- Groq

### Objectif

L’assistant IA aide le RH à analyser une candidature.

Il peut proposer :

- un score ;
- un résumé ;
- les points forts ;
- les points faibles ;
- une recommandation.

La décision finale reste toujours prise par le RH.

---

## 6. Notifications

### Technologie choisie

- Firebase Cloud Messaging, FCM

### Objectif

FCM permet d’envoyer une notification au candidat lorsque le statut de sa demande change.

Exemples :

- candidature acceptée ;
- candidature refusée ;
- test technique demandé ;
- entretien demandé.

---

## 7. Email

### Technologie choisie

- Gmail ou application mail via `mailto`

### Justification

L’application ne va pas envoyer directement les emails via SMTP.

Elle prépare seulement l’email avec :

- les destinataires ;
- le sujet ;
- le contenu.

Ensuite, Gmail ou l’application mail s’ouvre, et le RH clique lui-même sur envoyer.

Cette solution est simple, gratuite et adaptée au MVP.

---

## 8. DevOps et déploiement

### Technologies prévues

- GitHub ou GitLab
- Docker
- Docker Compose

### Objectif

Le projet est organisé dans un seul dépôt Git avec :

- un dossier frontend ;
- un dossier backend ;
- un dossier database ;
- un dossier docs.

Docker Compose permet de lancer facilement les services nécessaires, surtout PostgreSQL pendant la phase initiale.

---

## 9. Résumé des choix

| Partie | Technologie |
|---|---|
| Frontend | Angular + PrimeNG Sakai |
| Backend | Spring Boot |
| Base de données | PostgreSQL |
| Sécurité | Spring Security + JWT |
| IA | Gemini / Vertex AI ou Groq |
| Notification | Firebase FCM |
| Email | Gmail / mailto |
| Versioning | GitHub ou GitLab |
| Déploiement | Docker + Docker Compose |
