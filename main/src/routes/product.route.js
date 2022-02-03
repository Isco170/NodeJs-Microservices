const express = require('express');
let router = express.Router();
const prodController = require('../controller/product.controller');

router.post('/prod', prodController.addProd);
router.put('/prod', prodController.updateProd);
router.delete('/prod', prodController.deleteProd);
router.put('/like', prodController.likeProd)

module.exports = router;