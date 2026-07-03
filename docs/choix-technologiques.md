# Choix technologiques
Les technologies retenues ont été choisies pour leur robustesse, leur adéquation aux besoins fonctionnels du projet et leur complémentarité. Elles correspondent également à des outils que je maîtrise déjà. Dans le cadre de ce test technique réalisé sur une durée limitée, ce choix m'a permis de consacrer davantage de temps à la conception, à la qualité du code et à la mise en œuvre des fonctionnalités métier, plutôt qu'à la prise en main de nouvelles technologies.
## Technologies utilisées

| Domaine | Technologie | Usage |
|---|---|---|
| Frontend | Angular 21, TypeScript, RxJS | composants standalone, routage, formulaires et appels HTTP |
| UI | PrimeNG 21, Sakai, PrimeIcons | composants accessibles, thème et layout responsive |
| Visualisation | Chart.js 4 | statistiques des dashboards RH et candidat |
| Backend | Java 21, Spring Boot 4.1 | API REST et assemblage applicatif |
| Sécurité | Spring Security, JJWT, BCrypt | JWT stateless, rôles et hash des mots de passe |
| Validation | Jakarta Validation, Hibernate Validator | contraintes des DTO côté serveur |
| Persistance | Spring Data JPA, Hibernate | transactions, entités et repositories |
| Base | PostgreSQL 16 | stockage relationnel et contraintes |
| Automatisation | Spring Mail | notification email lors du changement de statut |
| Tests | JUnit, Mockito, Spring Boot Test | 53 tests unitaires métier |
| Build | Maven Wrapper, npm | builds reproductibles backend/frontend |
| Conteneurs | Docker, Docker Compose, Nginx | déploiement complet et reverse proxy `/api` |

## Pourquoi Angular et PrimeNG ?

J'ai choisi Angular pour son architecture robuste basée sur les composants et les services, son système de routage intégré, ainsi que ses mécanismes tels que les intercepteurs HTTP et les guards, qui facilitent la mise en place d'une application structurée et maintenable. L'utilisation des composants standalone permet également de réduire les dépendances aux modules et de simplifier l'organisation du projet.
PrimeNG a été retenu afin d'accélérer le développement de l'interface utilisateur grâce à une bibliothèque riche de composants prêts à l'emploi (tables, boîtes de dialogue, formulaires, notifications, graphiques, etc.), garantissant une interface homogène tout en limitant le temps consacré au développement de composants graphiques.

## Pourquoi Spring Boot ?

Spring Boot simplifie le développement d'applications Java grâce à son système d'auto-configuration et à son écosystème complet. Son architecture en couches permet de séparer clairement les responsabilités entre les contrôleurs, les services et la couche de persistance.
Les annotations transactionnelles assurent la cohérence des opérations impliquant plusieurs traitements, tandis que Spring Security et Jakarta Validation offrent des mécanismes standardisés pour la sécurisation des accès et la validation des données.

## Pourquoi PostgreSQL et JPA ?

Le modèle de données de l'application est relationnel : une demande est liée à un candidat, à une offre et, le cas échéant, à un responsable RH. PostgreSQL est un système de gestion de bases de données robuste garantissant l'intégrité des données grâce aux clés étrangères, aux contraintes d'unicité et aux transactions.
L'utilisation de JPA (Hibernate) permet de manipuler les données sous forme d'objets Java, de gérer les relations entre entités et de limiter l'écriture de SQL répétitif tout en conservant la possibilité d'utiliser des requêtes personnalisées lorsque cela est nécessaire.

## Pourquoi JWT et BCrypt ?

L'authentification repose sur des JSON Web Tokens (JWT) afin de mettre en œuvre une API REST sans état (stateless). Le jeton transporte les informations nécessaires à l'identification de l'utilisateur et à la gestion des autorisations.
Les mots de passe sont protégés à l'aide de BCrypt, un algorithme de hachage spécialement conçu pour le stockage sécurisé des mots de passe.

Les contrôles d'autorisation sont réalisés côté serveur avec Spring Security. Les guards Angular améliorent l'expérience utilisateur en limitant l'accès à certaines pages, mais ils ne remplacent jamais les contrôles de sécurité effectués par le backend.


## Pourquoi une notification SMTP ?

L'envoi automatique d'emails permet d'informer les utilisateurs lors des changements importants du workflow (validation, refus, changement de statut, etc.), sans nécessiter d'intervention manuelle.
Le service d'envoi est isolé du traitement métier afin qu'un éventuel échec d'envoi d'email n'empêche pas la validation de l'opération principale.

Cette solution répond au besoin fonctionnel tout en restant simple à mettre en œuvre dans le cadre du projet.

## Pourquoi Docker et Nginx ?

Docker Compose permet de reproduire facilement le même environnement d'exécution (backend, frontend et base de données) sur n'importe quelle machine, ce qui facilite le développement, les tests et le déploiement.
Les images Docker sont construites avec des multi-stage builds afin de produire des images plus légères en excluant les outils de compilation.

Nginx est utilisé pour servir l'application Angular en production, gérer le routage des requêtes vers l'API (/api) et masquer l'adresse interne du backend.


