const amqp = require('amqplib')
const config = require('../config');

/**
 * Factory function to connection AMQP
 * @param {String} uri
 */
async function createConnection () {
  const connection = await amqp.connect(config.rabbit.url)
  return connection
}

module.exports = {
  createConnection
}