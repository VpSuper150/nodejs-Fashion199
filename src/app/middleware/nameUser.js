const { SECRET } = require('../../util/sp');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = async function nameUser(req, res, next) {
    try {
        const idUser = jwt.verify(req.session.authUser, SECRET);
        const authenticated = await User.findOne({ _id: idUser });
        res.locals.lcAuthenticated = authenticated;
        res.locals.userName = req.session.userName;
        next();
    } catch (error) {
        next();
    }
};
