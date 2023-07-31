const express = require("express");
const app = express.Router();
const userController = require("../Controllers/userController");
const authenticate = require("../middleware/tokenVerify");

app.post("/signup",userController.signup);

app.post("/login",userController.login);

app.post("/addProduct",userController.addProduct);

app.post("/singleProduct",authenticate.authenticateToken,userController.singleProduct);

app.post("/addToCart",authenticate.authenticateToken,userController.addToCart);

app.get("/checkoutCart",authenticate.authenticateToken,userController.checkoutCart);

app.post("/placeOrder",authenticate.authenticateToken,userController.placeOrder);

app.get("/allOrder",authenticate.authenticateToken,userController.allOrders);

app.post("/orderDetails",authenticate.authenticateToken,userController.orderDetails);

app.post("/search",authenticate.authenticateToken,userController.Search);

module.exports = app
