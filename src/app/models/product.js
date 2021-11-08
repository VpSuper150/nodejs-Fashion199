const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDeleete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Products = new Schema({
    name: { type: String, require: true, maxlength: 255 },
    description: { type: String, require: true, maxlength: 600 },
    image: { type: String, lowercase: true, require: true, maxlength: 255 },
    stock: { type: Number, require: true },
    price: { type: Number, require: true },
    type: { type: String, lowercase: true, require: true },
    buyCounts: { type: Number, default: 0 },
    slug: { type: String, slug: 'name', unique: true },
    isSale: {
        status: { type: Boolean, default: false },
        percent: { type: Number, default: 0 },
        end: { type: Date },
    },
    ofSellers: {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String,
    },
    viewCounts: { type: Number, required: false, default: 0 },
    createdAt: { type: Date, default: Date.now }, // lưu thời gian khởi tạo
    updatedAt: { type: Date, default: Date.now }, // thời gian bản ghi được cập nhật
},    
{
    versionKey: false,
},
);
Products.plugin(mongooseDeleete, {
    overrideMethods: true,
    deletedAt: true,
});

module.exports = mongoose.model('products', Products);
