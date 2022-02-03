const { createConnection } = require('./index')

exports.default = async (data) => {

    const conn = await createConnection()
    const channel = await conn.createChannel()
    const queue = data.queue
    channel.assertQueue(queue)
    console.log('-> Sending message using default exchange')
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data.message)))

}

exports.direct = async (data) => {
    const conn = await createConnection()
    const channel = await conn.createChannel()
    
    const exchange = data.exchange

    channel.assertExchange(exchange, 'direct', { durable: false })

    // severity cab be for example 'warnig', 'info'
    //severity  is routingKey

    console.log('-> Sending message using direct exchange')
    channel.publish(exchange, data.routingKey,  Buffer.from(JSON.stringify(data.message)))
}

exports.topic = async (data) => {

  const conn = await createConnection()
  const channel = await conn.createChannel()
  
  const exchange = data.exchange

  channel.assertExchange(exchange, 'topic', { durable: false })
  console.log(' [x] Sending message [%s]', data.key, ' exchange: ',data.exchange)
  channel.publish(exchange, data.key, Buffer.from(JSON.stringify(data.message)))


}


exports.fanout = async (data) => {

  const conn = await createConnection()
  const channel = await conn.createChannel()
  
  const exchange = data.exchange

  // durable: se ela deve ser salva depois de restart do broker
  channel.assertExchange(exchange, 'fanout', { durable: true })

  // The empty string as second parameter means
      // that we don't want to send the message to any specific queue.
      // We want only to publish it to our 'logs' exchange.
  console.log(' [x] Sending message  exchange: ',data.exchange)

  channel.publish(exchange, '', Buffer.from(JSON.stringify(data.message)))

}

exports.rpc = async (data) => {

  const conn = await createConnection()
  const channel = await conn.createChannel()

  const queue = data.queue

  channel.assertQueue(queue, {
    durable: false
  })
  channel.prefetch(1)

  channel.consume(queue, function reply (msg) {
    const message = msg.content.toString()

    console.log(' [*] Received: %s', message)


    channel.sendToQueue(msg.properties.replyTo,
      Buffer.from(JSON.stringify(data.message)), {
        correlationId: msg.properties.correlationId
      })

      channel.ack(msg)
  })

}