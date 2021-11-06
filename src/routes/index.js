const shopRouter = require('./shop');
const accountRouter = require('./accounts');
const middleware = require('../app/middleware/nameUser');
const productRouter = require('./product');
function route(app) {
    app.use('/product', productRouter);
    app.use('/account', accountRouter);
    app.use('/', shopRouter);
}
module.exports = route;
