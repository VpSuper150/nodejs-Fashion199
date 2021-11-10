const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { mongoosetoObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../../util/sp');
const moment = require('moment');
const api_key = '86328e7e1bb1203b9e62b0c91827cb41-10eedde5-72194190';
const domain = 'sandbox9217aa53d6c84951bca6bd8bbb4dc938.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

class accountController {
    //[GET]/account/create
    create(req, res, next) {
        const error = req.flash('error')[0];
        res.render('account/register', {
            title: 'Đăng ký',
            error,
        });
    }
    //[GET]/account/login
    login(req, res, next) {
        const error = req.flash('error')[0];
        const message = req.flash('message')[0];
        res.render('account/login', {
            title: 'Đăng Nhập',
            error, 
            message,
        });
    }
    //[GET]/account/profile
    admin(req, res, next) {
        res.render('account/admin');
    }
    //[GET]/account/change-profile
    changeProfile(req, res, next) {
        const error = req.flash('error')[0];
        const message = req.flash('message')[0];
        const data = mongoosetoObject(req.data);
        const dob = moment(data.dob).format('YYYY-MM-DD');
        res.render('account/change-profile', {
            title: 'Tài Khoản',
            data,
            dob,
            error,
            message,
        });
    }
    //[GET]/account/change-password
    changePassword(req, res, next) {
        const error = req.flash('error')[0];
        const message = req.flash('message')[0];
        const email = req.data.email;
        res.render('account/change-password', {
            title: 'Đổi mật khẩu',
            error,
            email,
            message,
        });
    }
    //[GET]/account/resetpassword/:token
    resetPass(req, res, next) {
        const token = req.params.token;
        const email = req.data.email;
        res.render('account/forgotPassword', {
            email,
            token,
        });
    }
    //[GET]/account/email
    checkemail(req, res, next) {
        const error = req.flash('error')[0];
        const message = req.flash('message')[0];
        res.render('account/check-email', {
            error,
            message,
        });
    }
    //[POST]/account/create
    postCreate(req, res, next) {
        User.findOne({ email: req.body.email })
            .then((foundUser) => {
                if (foundUser) {
                    req.flash('error', 'Tên đăng nhập tồn tại');
                    return res.redirect('/account/create');
                }
                const password_hash = bcrypt.hashSync(req.body.password, 8);
                req.body.password_hash = password_hash;
                req.body.permission = 0;
                const entity = new User(req.body);
                return entity.save();
            })
            .then(() => {
                req.flash('message', 'Bạn vừa đăng ký thành công');
                return res.redirect('/account/login');
            })
            .catch(next);
    }
    //[PATCH]/account/change-profile
    updateProfile(req, res, next) {
        User.updateOne(
            { _id: req.data.id },
            {
                fullName: req.body.fullName,
                dob: req.body.dob,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
            },
        )
            .then(() => {
                req.flash('message', 'Thay đổi thành công');
                return res.redirect('/account/changeprofile');
            })
            .catch(next);
    }
    //[PATCH]/account/change-password
    updatePassword(req, res, next) {
        const password_hash = bcrypt.hashSync(req.body.newPassword, 8);
        User.updateOne({ _id: req.data.id }, { password_hash })
            .then(() => {
                req.flash('message', 'Đổi mật khẩu thành công');
                return res.redirect('/account/changepassword');
            })
            .catch(next);
    }
    //[GET]/account/resetpassword/:token
    resetPassword(req, res, next) {
        const password_hash = bcrypt.hashSync(req.body.newPassword, 8);
        User.updateOne({ _id: req.data.id }, { password_hash })
            .then(() => {
                req.flash('message', 'Đổi mật khẩu thành công');
                return res.redirect('/account/login');
            })
            .catch(next);
    }
    //[POST]/account/login
    postLogin(req, res, next) {
        const password = req.body.password;
        User.findOne({ email: req.body.email })
            .then((data) => {
                if (!data) {
                    req.flash('error', 'Sai email hoặc mật khẩu');
                    return res.redirect('/account/login');
                }
                const rs = bcrypt.compareSync(password, data.password_hash);
                if (!rs) {
                    req.flash('error', 'Sai email hoặc mật khẩu');
                    return res.redirect('/account/login');
                }
                const token = jwt.sign({ _id: data._id }, SECRET);
                req.session.authUser = token;
                req.session.userName = data.fullName;
                return res.redirect('/');
            })
            .catch(next);
    }
    //[POST]/account/checkemail
    otpResetPass(req, res, next) {
        User.findOne({ email: req.body.email })
            .then((data) => {
                if (data) {
                    const token = jwt.sign(
                        { email: data.email, password: data.password_hash },
                        SECRET,
                        { expiresIn: '10m' },
                    );
                    const message = {
                        from: 'fashion199@hello.com',
                        to: data.email,
                        subject: 'ĐỔI MẬT KHẨU',
                        html: `<h1>Bạn đang thực hiện đổi mật khẩu tài khoản:</h1>
                                <h3>Nếu hành động này là bạn thực hiện hãy kíc vào link bên dưới</h3>
                                <p>http://localhost:3000/account/resetpassword/${token}</p>
                                <h3>Nếu đây không phải do bạn thư hiện vui lòng không kíc vào link trên và liên hệ với chúng tôi</h3>
                                `,
                    };
                    mailgun.messages().send(message, function (error, body) {
                        console.log(body);
                    });
                    req.flash(
                        'message',
                        'Mã xác nhận đã được gửi đến email của bạn vui lòng kiểm tra email',
                    );
                    res.redirect('/account/email');
                } else {
                    req.flash('error', 'email không tồn tại');
                    res.redirect('/account/email');
                }
            })
            .catch(next);
    }
    //[POST]/account/logout
    Logout(req, res, nex) {
        req.session.destroy();
        return res.redirect(req.headers.referer);
    }
}
module.exports = new accountController();
