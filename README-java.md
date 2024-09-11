# Workshop :: Spring Boot 3 + OpenTelemetry
* Spring Boot 3.4 M2
* Opentelemetry
  * Distributes tracing
  * Structured log
  * Application metric

## Steps to run
```
$docker compose build java
$docker compose up -d java
$docker compose ps
```

List of urls
* API :: http://localhost:8080/hello
* Metric :: http://localhost:8080/actuator/prometheus

### Reference websites
* https://spring.io/blog/2024/08/23/structured-logging-in-spring-boot-3-4