const express = require('express');
let route = express.Router();
const productController = require('../controller/product.controller');

route.get('/', productController.getProducts);

module.exports = route;