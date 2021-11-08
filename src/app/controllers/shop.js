const Product = require('../models/product');
const { mongoosetoObjectS } = require('../../util/mongoose');
const { toArray } = require('../../util/sp');
const moment = require('moment');
const PAGE_SIZE = 9;
class ProductController {
    // [GET] /
    home(req, res, next) {
        res.render('shop', {
            title: 'Fashion',
        });


    }
    showMen(req, res, next) {
        let page = req.params.page;
        if(page){
            page = parseInt(page) > 0  ? parseInt(page) : 1 ;
            const skip = (page -1)* PAGE_SIZE;
            Product.find({ type: { $regex: 'nam' } })
            .skip(skip)
            .limit(PAGE_SIZE)
            .then((product) => {
                Product.countDocuments({ type: { $regex: 'nam' } }).then(total => {
                    const tongpage = total > 1 ?toArray(Math.ceil(total/PAGE_SIZE)) : 0;
                    product = mongoosetoObjectS(product);
                    res.render('products/listProduct', {
                        product,
                        tongpage,
                        title: 'Thời trang nam',
                    });
                })
            })
            .catch(next);
        }else {
            Product.find({ type: { $regex: 'nam' } })
            .skip(0)
            .limit(PAGE_SIZE)
            .then((product) => {
                Product.countDocuments({ type: { $regex: 'nam' } }).then(total => {
                    const tongpage = total > 1 ? toArray(Math.ceil(total/PAGE_SIZE)) : 0;
                    product = mongoosetoObjectS(product);
                    res.render('products/listProduct', {
                        product,
                        tongpage,
                        title: 'Thời trang nam',
                    });
                })
            })
            .catch(next);
        }
    }
    showWomen(req, res, next) {
        Product.find({ type: { $regex: 'nữ' } })
            .then((product) => {
                product = mongoosetoObjectS(product);
                res.render('products/listProduct', {
                    product,
                    title: 'Thời trang nữ',
                });
            })
            .catch(next);
    }

}

module.exports = new ProductController();
