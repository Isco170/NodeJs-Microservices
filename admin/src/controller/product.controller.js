const prodModel = require('../model/product.model');
const amqp = require('amqplib/callback_api');

async function getProducts(request, response) {
    const products = await prodModel.findAll();
    return response.json(products)
}

async function newProduct(request, response) {
    const product = await prodModel.create(request.body);
    amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            channel.sendToQueue('product_created', Buffer.from(JSON.stringify(product)))
        })
    })
    return response.send(product)
}

async function getOne(request, response) {
    const product = await prodModel.findOne({ where: { id: request.params.id } });
    return response.send(product);
}

async function updateProd(request, response) {
    const prod = await prodModel.update(request.body, { where: { id: request.body.id } });
    amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            channel.sendToQueue('product_updated', Buffer.from(JSON.stringify(prod)))
        })
    })
    return response.send(prod)
}

async function deleteProd(request, response) {
    const prod = await prodModel.destroy({ where: { id: request.params.id } });
    amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            channel.sendToQueue('product_deleted', Buffer.from(JSON.stringify(prod.id)))
        })
    })
    return response.send(true);
}

async function likeProd(request, response) {
    const prod = await prodModel.findOne({ where: { id: request.params.id } });

    await prodModel.update({ likes: prod.likes + 1 }, { where: { id: prod.id } });
    return response.send(prod);
}

module.exports = {
    getProducts,
    newProduct,
    getOne,
    updateProd,
    deleteProd,
    likeProd
}