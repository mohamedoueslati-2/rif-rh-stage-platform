# Choix technologiques

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

Angular impose une structure claire par composants et services, fournit le routage, l'interception HTTP et les guards. Les composants standalone réduisent le couplage aux modules globaux.

PrimeNG accélère la réalisation d'interfaces cohérentes : tables, dialogues, timeline, confirmations, messages, tags et graphiques. Sakai apporte le layout, mais les pages de démonstration inutiles ont été supprimées pour conserver uniquement le code métier.

## Pourquoi Spring Boot ?

L'architecture en couches sépare HTTP, métier et persistance. Les annotations transactionnelles protègent les opérations multi-étapes, tandis que Spring Security et Jakarta Validation fournissent des contrôles standardisés.

## Pourquoi PostgreSQL et JPA ?

Le domaine est relationnel : une demande lie un candidat, une offre et éventuellement un RH traitant. PostgreSQL garantit l'intégrité des UUID, clés étrangères et valeurs uniques. JPA représente l'héritage `Personne → Candidat/RH` et évite la construction manuelle de SQL utilisateur.

## Pourquoi JWT et BCrypt ?

Le JWT permet une API sans session serveur et transporte l'identité et le rôle. BCrypt protège les mots de passe au repos. Le rôle est contrôlé côté backend ; les guards Angular améliorent l'expérience mais ne remplacent pas l'autorisation serveur.

## Pourquoi une notification SMTP ?

L'email répond directement au besoin d'automatisation du workflow. Chaque changement de statut pertinent produit un message contextualisé. L'échec du fournisseur SMTP est isolé pour ne pas annuler la mise à jour métier déjà validée.

## Pourquoi Docker et Nginx ?

Docker Compose fournit le même environnement PostgreSQL/Java/Nginx sur chaque machine. Les builds multi-stage excluent Maven, Node et les sources des images finales. Nginx sert efficacement Angular, gère le fallback du routeur et masque l'adresse interne du backend derrière `/api`.


