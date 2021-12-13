const express = require('express');
let router = express.Router();
const prodController = require('../controller/product.controller');

router.get('/prod', prodController.readProd);

module.exports = router;