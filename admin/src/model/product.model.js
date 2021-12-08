const { DataTypes, Model } = require("sequelize");
const database = require('../database');

class Product extends Model {}

Product.init(
    {
        title: DataTypes.STRING,
        image: DataTypes.TEXT,
        likes:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },{ 
        sequelize: database,
        tableName: 'product'
    }
)

module.exports = Product;