const {Model,DataTypes,Sequelize} = require("sequelize");
const {database} = require("../config/database");

class OrderItem extends Model{}

OrderItem.init(
    {
        itemID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        orderID:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        productName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        productPrice:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        createdAt:{
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        updatedAt:{
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        }
    },
    {
        sequelize:database,
        modelName:"OrderItem",
        tableName:"orderitems"
    }
)

OrderItem.sync()

module.exports = {
    OrderItem
}