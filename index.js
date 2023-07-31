const express = require ("express");
const {database} = require ("./config/database");
const userRouter = require("./Routes/userRoute");
const {User} = require("./Models/userModel");

const app = express();
app.use(express.json())
app.use("/user",userRouter);

database.authenticate()
.then(()=>{
    console.log("Database has been connected!")
})
.catch(()=>{
    console.log("Unable to connect to the Database!");
})

app.listen(5000,console.log("Server is running!"));
