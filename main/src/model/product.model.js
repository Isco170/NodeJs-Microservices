var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        admin_id:{
            type: Number,
            unique: true
        },
        title:{
            type: String
        },
        image:{
            type: String
        },
        likes:{
            type: Number,
            default: 0
        }
    }
);

const Product = mongoose.model('product', productSchema);

module.exports = Product;