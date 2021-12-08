const express = require('express');
let route = express.Router();
const productController = require('../controller/product.controller');

route.get('/', productController.getProducts);
route.get('/:id', productController.getOne);
route.post('/', productController.newProduct);
route.put('/', productController.updateProd);
route.delete('/:id', productController.deleteProd);
route.post('/:id/like', productController.likeProd);

module.exports = route;