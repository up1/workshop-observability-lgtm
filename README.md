# Workshop :: Observability 
* Services
  * NodeJS 20
  * Java + Spring Boot 3
* Database
  * PostgreSQL
* Api gateway
  * Kong with db-less mode
  * Plug-ins
    * [Prometheus](https://docs.konghq.com/hub/kong-inc/prometheus/)
    * [HTTP Log](https://docs.konghq.com/hub/kong-inc/http-log/)
    * [OpenTelemetry](https://docs.konghq.com/hub/kong-inc/opentelemetry/)
* LGTM stack
  * Log with Loki
  * Grafana fir visualization
  * Tracing with Tempo
  * Metric with Prometheus

## 1. Start nodejs service and database

### Build image
```
$docker compose build nodejs
```

### Start services
```
$docker compose up -d nodejs
$docker compose ps
```

Access to nodejs services
* http://localhost:3002
* http://localhost:3002/steps
* http://localhost:3002/call-db


## 2. Start LGTM stack (for development only)
```
$docker compose up -d otel-collector
$docker compose ps
```

Access to grafana dashboard
* http://localhost:3000

## 3. Start API gateway with Kong

### Start FluentBit to store Kong's log
```
$docker compose up -d fluentbit
$docker compose ps
```

### Start Kong server
```
$docker compose up -d kong
$docker compose ps
```
Access to Kong GUI
* http://localhost:8002

### Access to nodejs services from API gateway
* http://localhost:8000/s1
* http://localhost:8000/s1/steps
* http://localhost:8000/s1/call-db


Access to grafana dashboard
* http://localhost:3000/explore
  * Loki
  * Tempo

## 4. Working with Application metric
* Kong's metric
  * http://localhost:8001/metrics
* NodeJS's metric
  * http://localhost:3002/metrics

### Start [PostgreSQL's exporter](https://github.com/prometheus-community/postgres_exporter)
```
$docker compose up -d db-exporter
$docker compose ps
```

PostgreSQL's metric
* http://localhost:9187/metrics
