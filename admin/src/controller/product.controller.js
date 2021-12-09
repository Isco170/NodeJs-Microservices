const prodModel = require('../model/product.model');
const amqp = require('amqplib/callback_api');

async function getProducts(request, response) {
    const products = await prodModel.findAll();
    amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            channel.sendToQueue('hello', Buffer.from('hello there'))
        })
    })
    return response.json(products)
}

async function newProduct(request, response) {
    const product = await prodModel.create(request.body);
    return response.send(product)
}

async function getOne(request, response) {
    const product = await prodModel.findOne({ where: { id: request.params.id } });
    return response.send(product);
}

async function updateProd(request, response) {
    const prod = await prodModel.update(request.body, { where: { id: request.body.id } });
    return response.send(prod)
}

async function deleteProd(request, response) {
    const prod = await prodModel.destroy({ where: { id: request.params.id } });
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