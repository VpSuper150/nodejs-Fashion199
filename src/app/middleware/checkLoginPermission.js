const { SECRET } = require('../../config/secret');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = async function (req, res, next) {
    try {
        const idUser = jwt.verify(req.session.authUser, SECRET);
        const foundUser = await User.findOne({ _id: idUser });
        if (foundUser) {
            req.data = foundUser;
            next();
        } else {
            res.redirect('/');
        }
    } catch {
        res.redirect('/');
    }
};
