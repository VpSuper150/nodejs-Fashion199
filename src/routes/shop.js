const express = require('express');
const router = express.Router();
const shopController = require('../app/controllers/shop');

router.get('/women', shopController.showWomen);
router.get('/men', shopController.showMen);
router.get('/:slug', shopController.home);
router.get('/', shopController.home);

module.exports = router;
