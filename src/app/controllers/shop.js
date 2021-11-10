const Product = require('../models/product');
const { mongoosetoObjectS, toArray } = require('../../util/mongoose');
const moment = require('moment');
const PAGE_SIZE = 9;
class ProductController {
    // [GET] /
    home(req, res, next) {
        Product.find({ 'isSale.status': true }).then((product) => {
            res.render('shop', {
                product: mongoosetoObjectS(product),
                title: 'Fashion',
            });
        });
    }
    showMen(req, res, next) {
        let page = req.params.page;
        if (page) {
            page = parseInt(page) > 0 ? parseInt(page) : 1;
            const skip = (page - 1) * PAGE_SIZE;
            Promise.all([
                Product.find({ type: { $regex: 'nam' } })
                    .skip(skip)
                    .limit(PAGE_SIZE),
                Product.countDocuments({ type: { $regex: 'nam' } }),
            ])
                .then(([product, total]) => {
                    const tongpage =
                        Math.ceil(total / PAGE_SIZE) > 1
                            ? toArray(Math.ceil(total / PAGE_SIZE))
                            : 0;
                    res.render('products/men', {
                        product: mongoosetoObjectS(product),
                        tongpage,
                        title: 'Thời trang nam',
                    });
                })
                .catch(next);
        } else {
            Promise.all([
                Product.find({ type: { $regex: 'nam' } })
                    .skip(0)
                    .limit(PAGE_SIZE),
                Product.countDocuments({ type: { $regex: 'nam' } }),
            ])
                .then(([product, total]) => {
                    const tongpage =
                        Math.ceil(total / PAGE_SIZE) > 1
                            ? toArray(Math.ceil(total / PAGE_SIZE))
                            : 0;
                    res.render('products/men', {
                        product: mongoosetoObjectS(product),
                        tongpage,
                        title: 'Thời trang nam',
                    });
                })
                .catch(next);
        }
    }
    showWomen(req, res, next) {
        let page = req.params.page;
        if (page) {
            page = parseInt(page) > 0 ? parseInt(page) : 1;
            const skip = (page - 1) * PAGE_SIZE;
            Promise.all([
                Product.find({ type: { $regex: 'nữ' } })
                    .skip(skip)
                    .limit(PAGE_SIZE),
                Product.countDocuments({ type: { $regex: 'nữ' } }),
            ])
                .then(([product, total]) => {
                    const tongpage =
                        Math.ceil(total / PAGE_SIZE) > 1
                            ? toArray(Math.ceil(total / PAGE_SIZE))
                            : 0;
                    res.render('products/women', {
                        product: mongoosetoObjectS(product),
                        tongpage,
                        title: 'Thời trang nữ',
                    });
                })
                .catch(next);
        } else {
            Promise.all([
                Product.find({ type: { $regex: 'nữ' } })
                    .skip(0)
                    .limit(PAGE_SIZE),
                Product.countDocuments({ type: { $regex: 'nữ' } }),
            ])
                .then(([product, total]) => {
                    const tongpage =
                        Math.ceil(total / PAGE_SIZE) > 1
                            ? toArray(Math.ceil(total / PAGE_SIZE))
                            : 0;
                    res.render('products/women', {
                        product: mongoosetoObjectS(product),
                        tongpage,
                        title: 'Thời trang nữ',
                    });
                })
                .catch(next);
        }
    }
}

module.exports = new ProductController();
