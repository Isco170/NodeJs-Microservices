const prodModel = require('../model/product.model');
const consumer = require('../rabbitMQ/consumer');

async function addProd(request, response) {

    event_product = await consumer.fanout({exchange: 'product_created'})
    console.log(event_product)
    // if (event_product) {
    //     const product = {
    //         'admin_id': parseInt(event_product.id),
    //         'title': event_product.title,
    //         'image': event_product.image,
    //         'likes': event_product.likes
    //     }
    //     await prodModel.create(product);
    //     console.log('Product created')
    // }else{
    //     console.log("No prod")
    // }

    return response.status(202).send({
        msg: 'saved'
    })
}

async function updateProd(request, response) {
    const event_product = consumer.fanout('product_updated')
    const newProd = {
        'admin_id': parseInt(event_product.id),
        'title': event_product.title,
        'image': event_product.image,
        'likes': event_product.likes
    }

    const query = { admin_id: newProd.admin_id };
    const prod = await prodModel.findOneAndUpdate(query, newProd)

    console.log('Product updated ' + newProd.admin_id)
    console.log(prod)
    return response.status(202).send('done')
}

async function deleteProd(request, response) {

    const event_product = consumer.fanout('product_deleted')

    const product = parseInt(event_product);
    const query = { admin_id: product }
    await prodModel.findOneAndDelete(query);

    return response.status(202).send({
        msg: 'saved'
    })
}

async function likeProd(request, response) {
    const event_product = consumer.fanout('product_liked')

    const product = {
        'admin_id': parseInt(event_product.id),
        'likes': parseInt(event_product.likes) + 1
    }
    const query = { admin_id: product.admin_id }
    await prodModel.findOneAndUpdate(query, product)


    return response.status(202).send({
        msg: 'Liked'
    })
}

module.exports = {
    addProd,
    updateProd,
    deleteProd,
    likeProd
}