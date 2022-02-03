const { createConnection } = require('./index')
const { v4: uuidv4 } = require('uuid');

exports.default = async (data) => {
    const conn = await createConnection()
    const channel = await conn.createChannel()

    channel.assertQueue(data.queue)
    channel.consume(data.queue, function (msg) {
        if (msg !== null) {
            console.log('%s Received: %s', new Date(), msg.content.toString())
            channel.ack(msg)
            data.execute(JSON.parse(msg.content.toString()))
        }
    })
}

exports.direct = async (data) => {
    const conn = await createConnection()
    const channel = await conn.createChannel()

    const exchange = data.exchange
    channel.assertExchange(exchange, 'direct', { durable: false })

    const q = await channel.assertQueue(data.queue)
    // routes are array of exchange Binding routing key: critical
    data.routesKey.forEach((routesKey) => {
        channel.bindQueue(q.queue, exchange, routesKey)
    })

    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            console.log('%s [x] %s [%s]', Date.now(), msg.content.toString(), msg.fields.routingKey)
            data.execute(JSON.parse(msg.content.toString()))
        }
    }, {
        noAck: true
    })
}

exports.topic = async (data) => {

    const conn = await createConnection()
    const channel = await conn.createChannel()

    const exchange = data.exchange

    channel.assertExchange(exchange, 'topic', { durable: false })
    const q = await channel.assertQueue('', { exclusive: true })
    const routingKey = data.routingKey // routing key: '#' receive all
    console.log(' [*] Waiting for messages in %s.', q.queue)
    channel.bindQueue(q.queue, exchange, routingKey)

    console.log(' [x] Binded %s', routingKey)

    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            console.log('%s [x] %s [%s]', Date.now(), msg.content.toString(), msg.fields.routingKey)
            data.execute(JSON.parse(msg.content.toString()))
        }
    }, {
        noAck: true
    })



}


exports.fanout = async (data) => {
    var prod = null;
    const conn = await createConnection()
    const channel = await conn.createChannel()

    const exchange = data.exchange

    channel.assertExchange(exchange, 'fanout', { durable: true })
    const q = channel.assertQueue('', { exclusive: true })


    channel.bindQueue(q.queue, exchange, '')
    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            console.log('%s [x] %s [%s]', Date.now(), msg.content.toString(), msg.fields.routingKey)
            // data.execute(JSON.parse(msg.content.toString()))
            prod =  JSON.parse(msg.content.toString());
        }
    }, {
        noAck: true
    })

    console.log(prod)
    return prod;

}

exports.rpc = async (data) => {
    const conn = await createConnection()
    const channel = await conn.createChannel()
    const q = await channel.assertQueue('', { exclusive: true })
    const queue = data.queue
    const correlationId = uuidv4()
    // data.response is data that will be send as response to producer
    channel.sendToQueue(queue, Buffer.from(data.response), {
        replyTo: q.queue, correlationId

    })
    channel.consume(q.queue, function (msg) {
        if (msg !== null && msg.properties.correlationId === correlationId) {
            console.log('[%s] Received: %s', msg.properties.correlationId, msg.content.toString())
            data.execute(JSON.parse(msg.content.toString()))
        }
    }, { noAck: true })

}
