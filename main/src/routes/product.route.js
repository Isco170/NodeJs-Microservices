const express = require('express');
let router = express.Router();
const prodController = require('../controller/product.controller');

router.get('/prod', prodController.readProd);
router.post('/prod', prodController.addProd);
router.put('/prod', prodController.updateProd);
router.delete('/prod', prodController.deleteProd)

module.exports = router;