# Choix technologiques

## 1. Technologies réellement utilisées

| Domaine | Technologie | Usage dans le projet |
|---|---|---|
| Langage backend | Java 21 | Records DTO, text blocks et logique métier |
| Framework backend | Spring Boot 4.1.0 | Configuration et assemblage de l’API |
| API HTTP | Spring Web MVC | Contrôleurs REST et sérialisation JSON |
| Persistance | Spring Data JPA / Hibernate | Entités, transactions et repositories |
| Base de données | PostgreSQL | Stockage relationnel |
| Sécurité | Spring Security | Authentification, autorisation et sécurité par rôles |
| Tokens | JJWT 0.12.6 | Création et validation des JWT HS256 |
| Mots de passe | BCrypt | Hash des mots de passe candidat et RH |
| Validation | Jakarta Validation / Hibernate Validator | Validation des DTO d’entrée |
| Email | Spring Boot Starter Mail | Envoi SMTP avec `JavaMailSender` |
| Réduction du code répétitif | Lombok 1.18.40 | Constructeurs et accesseurs |
| Build | Maven Wrapper | Build reproductible du backend |
| Tests | Spring Boot Test, JUnit 5, Mockito | Tests unitaires des services métier |
| Frontend | Angular 21, PrimeNG 21, Sakai | Interface web |

## 2. Justification du backend Spring Boot

L’architecture en couches de Spring Boot convient au domaine : les contrôleurs restent centrés sur HTTP, les services concentrent les règles métier, et les repositories isolent la persistance. Les annotations transactionnelles protègent les opérations multi-étapes telles que la création d’une demande ou le changement de statut.

## 3. Justification de PostgreSQL et JPA

Le domaine est fortement relationnel : une demande relie un candidat, une offre et éventuellement un RH traitant. PostgreSQL fournit les contraintes et relations nécessaires, tandis que JPA matérialise l’héritage entre `Personne`, `Candidat` et `RH` et les associations entre les entités.

## 4. Justification de JWT et BCrypt

Le JWT permet une API REST sans session serveur et transporte l’identité et le rôle du compte connecté. BCrypt évite le stockage des mots de passe en clair. Les autorisations sont contrôlées à la fois dans la chaîne de filtres HTTP et avec `@PreAuthorize`.

## 5. Justification de SMTP

Spring Mail envoie directement des messages textuels lors du changement de statut. La configuration est externalisée et peut pointer vers Gmail ou un autre fournisseur SMTP. L’envoi est volontairement simple pour le MVP, et son échec est isolé afin de ne pas bloquer la décision RH.

## 6. Éléments non retenus dans l’implémentation actuelle

Le projet ne contient pas de dépendance ni de service pour :

- Gemini, Vertex AI, Groq ou une autre IA ;
- Firebase Cloud Messaging ;
- Gmail API ou liens `mailto` ;
- broker de messages ou file asynchrone ;
- table de notifications.

Ces technologies ne doivent donc pas être présentées comme des fonctions disponibles.
