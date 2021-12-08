const product = require('../model/product.model');

async function getProducts(request, response){
    const products = await product.findAll();
    return response.json(products)
}
 module.exports = {
     getProducts
 }