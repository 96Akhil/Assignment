const {Sequelize} = require("sequelize");

// const database = new Sequelize({
//     dialect:'mysql',
//     host:'sql6.freesqldatabase.com',
//     username:'sql6635893',
//     password:'SwVy77APsj',
//     database:'sql6635893',
// })

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