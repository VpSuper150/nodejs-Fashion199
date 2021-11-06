const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/product');
const checkLoginPermission = require('../app/middleware/checkLoginPermission');
const changeProfile = require('../app/middleware/changeProfile');
const changePassword = require('../app/middleware/changePassword');
const checkadmin = require('../app/middleware/checkAdmin');
const checkLogin = require('../app/middleware/checkLogin');
const tokenChangePassword = require('../app/middleware/tokenChangePassword');

router.post('/creat', productController.postcreat);
router.patch('/:id/restore', productController.restore);
router.delete('/:id/forceDestory', productController.forceDestory); // xóa vĩnh viễn
router.delete('/:id', productController.delete); // xóa tạm thời
router.put('/:id', productController.update);
router.get('/:id/edit',checkLoginPermission,checkadmin, productController.edit);
router.post('/handle-form-restore', productController.handleFormRestore);
router.post('/handle-form-actions', productController.handleForm);
router.get('/trash',checkLoginPermission,checkadmin, productController.trash);
router.get('/store',checkLoginPermission,checkadmin, productController.show);
router.get('/creat',checkLoginPermission, productController.creat);
router.get('/:slug', productController.showproduct);

module.exports = router;
