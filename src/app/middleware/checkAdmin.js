module.exports = function (req, res, next) {
    const permission = req.data.permission;
    if (permission === 'admin') {
        next();
    } else {
        res.redirect('back');
    }
};
