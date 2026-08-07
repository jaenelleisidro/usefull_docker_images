# Stage 1: Runtime environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Argument matching your generated JAR file name
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Document that the container listens on port 8080
EXPOSE 8080

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
