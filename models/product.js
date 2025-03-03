const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    status: { type: Boolean, default: true }
});



const mongoosePaginate = require('mongoose-paginate-v2');

productSchema.plugin(mongoosePaginate); 

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

