const { SECRET } = require('../../util/sp');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = async function (req, res, next) {
    try {
        const profile = jwt.verify(req.params.token, SECRET);
        const checkemail = await User.findOne({ email: profile.email });
        if (checkemail) {
            req.data = checkemail;
            next();
        } else {
            req.flash('error', 'email không tồn tại');
            return res.redirect('/account/email');
        }
    } catch {
        return res.redirect('/');
    }
};
