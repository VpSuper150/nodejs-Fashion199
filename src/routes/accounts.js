const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/account');
const checkLoginPermission = require('../app/middleware/checkLoginPermission');
const changeProfile = require('../app/middleware/changeProfile');
const changePassword = require('../app/middleware/changePassword');
const checkadmin = require('../app/middleware/checkAdmin');
const checkLogin = require('../app/middleware/checkLogin');
const tokenChangePassword = require('../app/middleware/tokenChangePassword');

router.patch(
    '/resetpassword/:token',
    tokenChangePassword,
    accountController.resetPassword,
);
router.patch(
    '/changepassword',
    changePassword,
    accountController.updatePassword,
);
router.put('/changeprofile', changeProfile, accountController.updateProfile);
router.post('/email', accountController.otpResetPass);
router.post('/logout', accountController.Logout);
router.post('/create', accountController.postCreate);
router.post('/login', accountController.postLogin);

router.get(
    '/resetpassword/:token',
    tokenChangePassword,
    accountController.resetPass,
);
router.get(
    '/changepassword',
    checkLoginPermission,
    accountController.changePassword,
);
router.get(
    '/admin',
    checkLoginPermission,
    checkadmin,
    accountController.admin,
);
router.get(
    '/changeprofile',
    checkLoginPermission,
    accountController.changeProfile,
);
router.get('/login', checkLogin, accountController.login);
router.get('/create', checkLogin, accountController.create);
router.get('/email', accountController.checkemail);

module.exports = router;
