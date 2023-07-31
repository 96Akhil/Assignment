const {Model,DataTypes,Sequelize} = require("sequelize");
const {database} = require("../config/database");

class Cart extends Model{}

Cart.init(
    {
        cartID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        userID:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        productID:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        productName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        inCart:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:1
        },
        orderPlaced:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        }
    },
    {
        sequelize:database,
        modelName:"Cart",
        tableName:"usercart"
    }
)

Cart.sync()

module.exports = {
    Cart
}