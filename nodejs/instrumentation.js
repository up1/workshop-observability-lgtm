const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-proto');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    //url: 'http://localhost:9193/v1/traces',
    url: process.env.OTEL_COLLECTOR_SERVER + '/v1/traces' || 'http://localhost:4318/v1/traces', 
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_COLLECTOR_SERVER + '/v1/metrics' || 'http://localhost:4318/v1/metrics', // Send to Jaeger (otel collector)
      headers: {}, // an optional object containing custom headers to be sent with each request
      concurrencyLimit: 1, // an optional limit on pending requests
    }),
    exportIntervalMillis: 1000
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // only instrument fs if it is part of another trace
      '@opentelemetry/instrumentation-fs': {
        requireParentSpan: true,
      },
    }),
    new ExpressInstrumentation(),
    new PgInstrumentation(),
    new PinoInstrumentation(),
],
});

sdk.start();