FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.m2,rw mvn clean package -DskipTests
# RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
ARG version=2.7.0
WORKDIR /app
COPY --from=builder /app/ ./
ADD --chmod=644 https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v$version/opentelemetry-javaagent.jar /usr/src/app/opentelemetry-javaagent.jar
ENV JAVA_TOOL_OPTIONS=-javaagent:/usr/src/app/opentelemetry-javaagent.jar

EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/app/target/api.jar" ]