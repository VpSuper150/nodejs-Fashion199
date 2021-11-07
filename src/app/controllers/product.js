const Product = require('../models/product');
const { mongoosetoObjectS } = require('../../util/mongoose');
const { mongoosetoObject } = require('../../util/mongoose');
const moment = require('moment');
class editProductController {
    //[GET]/account/creat
    show(req, res, next) {
        const message = req.flash('message')[0];
        let productQuery = Product.find({});
        Promise.all([productQuery, Product.countDocumentsDeleted()]).then(
            ([product, deleteProduct]) => {
                res.render('products/store', {
                    deleteProduct,
                    product: mongoosetoObjectS(product),
                    title: 'Sản phẩm đã đăng',
                    message,
                });
            },
        );
    }
    showproduct(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                if (!product) {
                    res.redirect('/');
                }
                res.render('products/product', {
                    product: mongoosetoObject(product),
                });
            })
            .catch(next);
    }
    //[GET]/account/trash-account
    trash(req, res, next) {
        Product.findDeleted({})
            .then((product) =>
                res.render('products/trash', {
                    product: mongoosetoObjectS(product),
                    title: 'Sản phẩm đã xóa',
                }),
            )
            .catch(next);
    }
    //[GET]/product/creat
    creat(req, res, next) {
        const error = req.flash('error')[0];
        const message = req.flash('message')[0];
        res.render('products/creat', {
            title: 'Đăng sản phẩm',
            error,
            message,
        });
    }
    //[GET]/product/id/edit
    edit(req, res, next) {
        const error = req.flash('error')[0];
        const message = req.flash('message')[0];
        Product.findById(req.params.id)
            .then((product) =>
                res.render('products/edit', {
                    product: mongoosetoObject(product),
                    title: 'Sửa sản phẩm',
                    error,
                    message,
                }),
            )
            .catch(next);
    }
    //[DELE] / product/id/delete
    delete(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('/product/store'))
            .catch(next);
    }
    // [PATCH] /product/ id/restore
    restore(req, res, next) {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[PUT] /id
    update(req, res, next) {
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                req.flash('message', 'Sửa sản phẩm thành công');
                res.redirect('/product/store');
            })
            .catch(() => {
                req.flash('error', 'Sửa sản phẩm thất bại');
                return res.redirect('/product/edit');
            });
    }
    //[POST]/product/creat
    postcreat(req, res, next) {
        const product = new Product(req.body);
        product
            .save()
            .then(() => {
                req.flash('message', 'Đăng sản phẩm thành công');
                return res.redirect('/product/creat');
            })
            .catch(() => {
                req.flash('error', 'Đăng sản phẩm thất bại');
                return res.redirect('/product/creat');
            });
    }
    //[Delete] / id/ forceDestory
    forceDestory(req, res, next) {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[POST] / product/handle-form-actions
    handleForm(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Product.delete({ _id: { $in: req.body.productIds } }) // vì req.body.courseId trả về 1 mảng nên trong mongdb ta dùng $in để lọc trong mảng
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.send('Trống');
        }
    }
    //[POST] /product/handle-form-restore
    handleFormRestore(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Product.restore({ _id: { $in: req.body.productIds } }) // vì req.body.courseId trả về 1 mảng nên trong mongdb ta dùng $in để lọc trong mảng
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'permanently':
                Product.deleteMany({ _id: { $in: req.body.productIds } }) // vì req.body.courseId trả về 1 mảng nên trong mongdb ta dùng $in để lọc trong mảng
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.send('Trống');
        }
    }
}

module.exports = new editProductController();
