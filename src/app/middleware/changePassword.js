const { SECRET } = require('../../config/secret');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { mongoosetoObject } = require('../../util/mongoose');
const moment = require('moment');
module.exports = async function (req, res, next) {
    try {
        const idUser = jwt.verify(req.session.authUser, SECRET);
        const foundUser = await User.findOne({ _id: idUser });
        const password = bcrypt.compareSync(
            req.body.password,
            foundUser.password_hash,
        );
        if (password) {
            req.data = foundUser;
            next();
        } else {
            req.flash('error', 'Sai mật khẩu');
            return res.redirect('/account/changepassword');
        }
    } catch {
        req.flash('error', 'Thay đổi không thành công');
        return res.redirect('/account/changepassword');
    }
};
