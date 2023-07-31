const {Sequelize} = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const database = new Sequelize({
    dialect:'mysql',
    host:'localhost',
    username:'root',
    password:'passwordForSql1!',
    database:'mydatabase'
})

module.exports={
    database
}