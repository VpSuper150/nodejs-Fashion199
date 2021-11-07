const Product = require('../models/product');
const { mongoosetoObjectS } = require('../../util/mongoose');
const moment = require('moment');

class ProductController {
    // [GET] /
    home(req, res, next) {
        Product.find({}) // truyền 1 object chống
            .then((product) => {
                product = mongoosetoObjectS(product.map((product) => product));
                res.render('shop', {
                    product,
                    title: 'Fashion',
                });
            })
            .catch(next);
    }
    showMen(req, res, next) {
        Product.find({ type: { $regex: 'nam' } })
            .then((product) => {
                product = mongoosetoObjectS(product.map((product) => product));
                res.render('products/listProduct', {
                    product,
                    slug: 'men',
                    title: 'Thời trang nam',
                });
            })
            .catch(next);
    }
    showWomen(req, res, next) {
        Product.find({ type: { $regex: 'nữ' } })
            .then((product) => {
                product = mongoosetoObjectS(product.map((product) => product));
                res.render('products/listProduct', {
                    product,
                    slug: 'women',
                    title: 'Thời trang nữ',
                });
            })
            .catch(next);
    }
    admin(req, res, next){
        res.render('account/admin');
    }
}

module.exports = new ProductController();
