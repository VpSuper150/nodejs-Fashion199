const express = require('express');
const router = express.Router();
const shopController = require('../app/controllers/shop');

router.get('/women/:page', shopController.showWomen);
router.get('/women', shopController.showWomen);
router.get('/men/:page', shopController.showMen);
router.get('/men', shopController.showMen);
router.get('/', shopController.home);

module.exports = router;
