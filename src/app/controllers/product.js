const Product = require('../models/product');
const { mongoosetoObjectS, mongoosetoObject } = require('../../util/mongoose');
const { toArray } = require('../../util/sp');
const moment = require('moment');
const PAGE_SIZE = 10;
class editProductController {
    //[GET]/account/creat
    show(req, res, next) {
        const message = req.flash('message')[0];
        let page = req.params.page;
        if (page) {
            page = parseInt(page) > 0 ? parseInt(page) : 1;
            const skip = (page - 1) * PAGE_SIZE;
            Promise.all([
                Product.find({}).skip(skip).limit(PAGE_SIZE),
                Product.countDocumentsDeleted(),
                Product.countDocuments({}),
            ])
                .then(([product, deleteProduct, total]) => {
                    const tongpage =
                        Math.ceil(total / PAGE_SIZE) > 1
                            ? toArray(Math.ceil(total / PAGE_SIZE))
                            : 0;
                    res.render('products/store', {
                        deleteProduct,
                        product: mongoosetoObjectS(product),
                        tongpage,
                        message,
                        title: 'Sản phẩm đã đăng',
                    });
                })
                .catch(next);
        } else {
            Promise.all([
                Product.find({}).skip(0).limit(PAGE_SIZE),
                Product.countDocumentsDeleted(),
                Product.countDocuments({}),
            ])
                .then(([product, deleteProduct, total]) => {
                    const tongpage =
                        Math.ceil(total / PAGE_SIZE) > 1
                            ? toArray(Math.ceil(total / PAGE_SIZE))
                            : 0;
                    res.render('products/store', {
                        deleteProduct,
                        product: mongoosetoObjectS(product),
                        tongpage,
                        message,
                        title: 'Sản phẩm đã đăng',
                    });
                })
                .catch(next);
        }
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
                Product.delete({ _id: { $in: req.body.productIds } })
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
                Product.restore({ _id: { $in: req.body.productIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'permanently':
                Product.deleteMany({ _id: { $in: req.body.productIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.send('Trống');
        }
    }
}

module.exports = new editProductController();
