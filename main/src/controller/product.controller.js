const prodModel = require('../model/product.model');
const amqp = require('amqplib/callback_api');

async function addProd(request, response){
    amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            channel.assertQueue('product_created', {durable: false})
            channel.assertQueue('product_updated', {durable: false})
            channel.assertQueue('product_deleted', {durable: false})


            channel.consume('product_created', async (msg) => {
                const event_product = JSON.parse(msg.content.toString());
                const product = {
                    'admin_id' : parseInt(event_product.id),
                    'title' : event_product.title,
                    'image' : event_product.image,
                    'likes' : event_product.likes
                }

                await prodModel.create(product);
                console.log('Product created')

            }, { noAck: true})
        })
    })

    return response.status(202).send({
        msg: 'saved'
    })
}

async function readProd(request, response){

}

async function readOneProd(request, response){

}

async function updateProd(request, response){

}

async function deleteProd(request, response){

}

module.exports = {
    addProd,
    readProd,
    readOneProd,
    updateProd,
    deleteProd
}