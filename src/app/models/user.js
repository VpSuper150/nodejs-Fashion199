const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
        },
        password_hash: {
            type: String,
            require: true,
        },
        fullName: {
            type: String,
            require: true,
            lowercase: true,
        },
        dob: {
            type: Date,
            require: true,
        },
        permission: {
            type: String,
            require: false,
        },
        address: {
            type: String,
            required: false,
        },
        phoneNumber: {
            type: String,
            required: false,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false,
    },
);

module.exports = mongoose.model('users', User);
