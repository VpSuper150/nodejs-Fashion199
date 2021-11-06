const { SECRET } = require('../../config/secret');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = async function (req, res, next) {
    try {
        if (req.session.authUser) {
            res.redirect('/');
        } else {
            next();
        }
    } catch {
        next();
    }
};
