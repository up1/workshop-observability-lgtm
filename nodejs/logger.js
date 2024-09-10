const pino = require('pino')

const transport = pino.transport({
  target: 'pino-opentelemetry-transport'
})

const logger = pino(transport)

module.exports = logger