# Étape 1 : compilation du projet Spring Boot avec Java 21.
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build

WORKDIR /workspace

# Le pom est copié séparément pour conserver le cache des dépendances Maven.
COPY pom.xml ./
RUN mvn -B -ntp dependency:go-offline

COPY src ./src
RUN mvn -B -ntp clean package -DskipTests

# Étape 2 : image d'exécution légère, sans Maven ni sources.
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl \
    && addgroup -S spring \
    && adduser -S spring -G spring

WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

USER spring:spring

EXPOSE 8090

HEALTHCHECK --interval=20s --timeout=5s --start-period=35s --retries=5 \
    CMD curl -fsS "http://localhost:${SERVER_PORT:-8090}/api/offres" || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
