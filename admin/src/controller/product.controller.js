const prodModel = require('../model/product.model');
const producer = require('../rabbitMQ/producer');

async function getProducts(request, response) {
    const products = await prodModel.findAll();
    return response.json(products)
}

async function newProduct(request, response) {
    const product = await prodModel.create(request.body);
    producer.fanout({ exchange: 'product_created', message: product})
   
    return response.send(product)
}

async function getOne(request, response) {
    const product = await prodModel.findOne({ where: { id: request.params.id } });
    return response.send(product);
}


async function updateProd(request, response) {
    const prod = await prodModel.update(request.body, { where: { id: request.body.id } });
    const updatedProd = await prodModel.findOne({where:{id: request.body.id}});
    producer.fanout({exchange: 'product_updated', message: updatedProd })

    return response.send(updatedProd)
}

async function deleteProd(request, response) {
    const prod = await prodModel.destroy({ where: { id: request.params.id } });
    producer.fanout({ exchange: 'product_deleted', message: request.params.id})

    return response.send(true);
}

async function likeProd(request, response) {
    const prod = await prodModel.findOne({ where: { id: request.params.id } });
    await prodModel.update({ likes: prod.likes + 1 }, { where: { id: prod.id } });
    producer.fanout({exchange: 'product_liked', message: prod});

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