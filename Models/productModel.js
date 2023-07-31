const {Model,DataTypes,Sequelize} = require("sequelize");
const {database} = require("../config/database");

class Product extends Model{}

Product.init(
    {
        productID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        productName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        productPrice:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        category:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.STRING,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        createdAt:{
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull:true
        },
        updatedAt:{
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull:true
        }
    },
    {
        sequelize:database,
        modelName:"Product",
        tableName:"producttable"
    }
)

Product.sync()

module.exports={
    Product
}