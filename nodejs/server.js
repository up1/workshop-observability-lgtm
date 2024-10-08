'use strict'
const getData = require('./db')
const express = require('express')
const { ExpressPrometheusMiddleware } = require('@matteodisabatino/express-prometheus-middleware')
const { trace, metrics } = require('@opentelemetry/api');
const logger = require('./logger')

// Custom metrics
const meter = metrics.getMeter("nodejs-service");
let counter = meter.createCounter("learn-metric", {
  description: "The number of requests per name the server got",
});

const app = express()
const epm = new ExpressPrometheusMiddleware()
const port = process.env.PORT || 3000
app.use(epm.handler)

// Main API
app.get('/', (req, res, next) => {
  // 1. Write logs
  logger.info({
    message: 'This is service from NodeJS',
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  // 2. Custom metrics
  const statuses = [200, 400, 500];
  const pos = Math.floor(Math.random() * statuses.length);
  counter.add(1, { desc: 'get-data', path: '/', status: statuses[pos] });
  // 3. Send response
  setTimeout(() => {
    res.json({ message: 'This is service from NodeJS' })
  }, Math.round(Math.random() * 200))
})

app.get('/call-db', async (req, res, next) => {
  logger.info({
    message: 'Called database',
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  await getData();
  res.json({ message: 'Called database' })
})

app.get('/steps', (req, res, next) => {
  logger.info({
    message: 'Called more steps',
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  const tracer = trace.getTracer('steps');
  return tracer.startActiveSpan('step-0', (span) => {
    try {
      step1()
      setTimeout(() => {
        console.log('Step final')
      }, Math.round(2000))
      return res.json({ message: 'Called more steps' })
    } catch (error) {
      console.error(error);
    } finally {
      span.end();
    }
  });
})

const step1 = () => {
  const tracer = trace.getTracer('steps');
  return tracer.startActiveSpan('step-1', (span) => {
    try {
      setTimeout(() => {
        console.log('Step 1')
        logger.info({
          message: 'Step 1'
        });
        step2()
      }, Math.round(Math.random() * 200))
    } catch (error) {
      console.error(error);
    } finally {
      span.end();
    }
  });
}

const step2 = () => {
  const tracer = trace.getTracer('steps');
  return tracer.startActiveSpan('step-2', (span) => {
    try {
      setTimeout(() => {
        console.log('Step 2')
        logger.info({
          message: 'Step 2'
        });
      }, Math.round(Math.random() * 200))
    } catch (error) {
      console.error(error);
    } finally {
      span.end();
    }
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

process.on('SIGTERM', () => {
  clearInterval(metricsInterval)
  process.exit(0)
})