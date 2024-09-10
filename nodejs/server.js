'use strict'
const getData = require('./db')
const express = require('express')
const { ExpressPrometheusMiddleware } = require('@matteodisabatino/express-prometheus-middleware')
const { trace } = require('@opentelemetry/api');
const logger = require('./logger')

const app = express()
const epm = new ExpressPrometheusMiddleware()
const port = process.env.PORT || 3000
app.use(epm.handler)

// Main API
app.get('/', (req, res, next) => {
  logger.info('This is service from NodeJS')
  setTimeout(() => {
    res.json({ message: 'This is service from NodeJS' })
  }, Math.round(Math.random() * 200))
})

app.get('/call-db', async (req, res, next) => {
  await getData();
  res.json({ message: 'Called database' })
})

app.get('/steps', (req, res, next) => {
  const tracer = trace.getTracer('steps');
  return tracer.startActiveSpan('step-0', (span) => {
    try {
      step1()
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
      }, Math.round(Math.random() * 200))
      step2()
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