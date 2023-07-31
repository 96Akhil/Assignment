const {Model,DataTypes,Sequelize} = require("sequelize");
const {database} = require("../config/database");

class Order extends Model{}

Order.init(
    {
        orderID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        userID:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        userEmail:{
            type:DataTypes.STRING,
            allowNull:false
        },
        userAddress:{
            type:DataTypes.STRING,
            allowNull:false
        },
        paymentMode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        totalAmount:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        createdAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        sequelize:database,
        modelName:"Order",
        tableName:"userorder"
    }
)

Order.sync()

module.exports={
    Order
}