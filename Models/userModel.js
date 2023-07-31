const {Model,DataTypes, Sequelize} = require("sequelize");
const {database} = require("../config/database");

class User extends Model{}

User.init(
    {
        userID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        phoneNumber:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        emailId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
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
        sequelize: database,
        modelName:"User",
        tableName:"userregistration",
    }
)

User.sync()

module.exports = {
    User
}
