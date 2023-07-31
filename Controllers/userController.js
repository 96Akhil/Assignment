const { User } = require("../Models/userModel");
const { Product } = require("../Models/productModel");
const { Cart } = require("../Models/cartModel");
const { Order } = require("../Models/orderModel");
const { OrderItem } = require("../Models/orderItemsModel");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const eSearch = require("../config/elasticSearch");

//Controller for the user to signup
const signup = async function (req, res) {
  try {
    const { firstName, lastName, phoneNumber, emailId, password } = req.body;
    // Checking if the user already exists in the database.
    const userCheck = await User.findOne({
      where: { emailId: emailId },
    });
    if (userCheck != null) {
      return res.status(200).json({ message: "The user already exists" });
    } else {
      //Hashing the password before storing it in the database
      const salt = bcrypt.genSaltSync(10);
      const encryptPass = bcrypt.hashSync(password, salt);
      const userData = await User.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        emailId: emailId,
        password: encryptPass,
      });

      if (userData) {
        res.status(200).json({ message: "User has been registered!" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller for the user login
const login = async function (req, res) {
  try {
    const { emailId, password } = req.body;
    //Checking if its a registered user
    const emailCheck = await User.findOne({ where: { emailId: emailId } });
    if (emailCheck == null) {
      return res
        .status(400)
        .json({ message: "Email doesn't exist, kindly signup!" });
    } else {
      //Comparing the entered password and the encrypted password
      const passwordCheck = await bcrypt.compare(password, emailCheck.password);
      if (passwordCheck) {
        //Creating an object with user's data to be stored in the token
        const payLoad = {
          id: emailCheck.userID,
          userEmail: emailCheck.emailId,
        };
        const token = jwt.sign(payLoad, jwtSecret);
        res.status(200).json({ message: "Login Successfull!", token: token });
      } else {
        res.status(400).json({ message: "Email or password is incorrect!" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller to get the details of an individual product
const singleProduct = async function (req, res) {
  try {
    const productId = req.body.product;
    const productDetails = await Product.findOne({
      where: { productID: productId },
    });
    if (productDetails) {
      res.status(200).json({ product: productDetails });
    } else {
      res
        .status(400)
        .json({ message: "Sorry, the product detail is unavailable!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller to add products
const addProduct = async function (req, res) {
  try {
    const { productName, price, category, description, quantity } = req.body;
    const productAdd = await Product.create({
      productName: productName,
      productPrice: price,
      category: category,
      description: description,
      quantity: quantity,
    });
    const allProducts = await Product.findAll();

    eSearch.createIndex();
    eSearch.indexData(allProducts);

    if (productAdd) {
      res.status(200).json({ message: "Product has been successfully added!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller to add a product into the cart
const addToCart = async function (req, res) {
  try {
    //UserId is taken from the token that is being sent in the request headers
    const userId = req.userID;
    const { productId, quantity } = req.body;

    //Checking the available stock in the inventory
    const productCheck = await Product.findOne({
      where: { productID: productId },
    });

    if (quantity > productCheck.quantity) {
      return res.status(200).json({ message: "Insufficient stock available!" });
    } else {
      //Checking if the product is already there in the user's cart
      const cartCheck = await Cart.findOne({
        where: { userID: userId, productID: productId, inCart: 1 },
      });

      if (cartCheck) {
        cartCheck.quantity = cartCheck.quantity + quantity;
        cartCheck.price =
          cartCheck.price + productCheck.productPrice * quantity;
        const cartUpdate = await cartCheck.save();
        if (cartUpdate) {
          return res.status(200).json({
            message: "Product has been successfully added to the cart!",
          });
        } else {
          return res
            .status(500)
            .json({ message: "Unable to add the product to the cart!" });
        }
      } else {
        // If its a new product then adding it to the cart
        const totalPrice = productCheck.productPrice * quantity;
        const newProduct = await Cart.create({
          userID: userId,
          productID: productId,
          productName: productCheck.productName,
          price: totalPrice,
          quantity: quantity,
        });

        if (newProduct) {
          return res.status(200).json({ message: "Product has been added" });
        } else {
          return res
            .status(500)
            .json({ message: "Unable to add the product to the cart!" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller to check the items present in the cart
const checkoutCart = async function (req, res) {
  try {
    const userId = req.userID;
    const cartItems = await Cart.findAll({
      where: { userID: userId, inCart: 1 },
    });
    if (cartItems.length > 0) {
      return res.status(200).json({ cart: cartItems });
    } else {
      return res.status(400).json({ message: "Your cart is empty!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller to confirm the user's order
const placeOrder = async function (req, res) {
  try {
    const userId = req.userID;
    const userEmail = req.email;
    const { address, payment } = req.body;
    //Finding all the products in the user's cart
    const userCart = await Cart.findAll({
      where: { userID: userId, inCart: 1 },
    });
    if (userCart.length > 0) {
      let totalPrice = 0;
      //Looping through the data from the cart to store it in orderItem table
      const orderItems = userCart.map((cartData) => {
        totalPrice = totalPrice + cartData.price;
        return {
          productName: cartData.productName,
          quantity: cartData.quantity,
          productPrice: cartData.price,
          orderID: null,
        };
      });

      //Generating the orderId and storing the data in the order table
      const userOrder = await Order.create({
        userID: userId,
        userEmail: userEmail,
        userAddress: address,
        paymentMode: payment,
        totalAmount: totalPrice,
      });

      //The generated orderId is also added along with the data before storing it into orderItems table
      if (userOrder) {
        for (const object of orderItems) {
          object.orderID = userOrder.orderID;
        }
        const itemData = await OrderItem.bulkCreate(orderItems);
        if(itemData){

          //Removing the items from the customer's cart
          const cartUpdate = await Cart.update({inCart:0,orderPlaced:1},{where:{userID:userId,inCart:1}});
          for(const items of userCart){
            const itemId = items.productID
            const itemQuantity = items.quantity

            //Updating the stock after the order has been placed
            const stockCheck = await Product.findByPk(itemId)
            stockCheck.quantity = stockCheck.quantity - itemQuantity;
            await stockCheck.save();
          }
        }
        res.status(200).json({ message: "Order has been placed!" });
      }
    } else {
      res.status(400).json({ message: "Cart is empty!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Controller to view all the orders placed by the user
const allOrders = async function(req,res){
  try {
    const userId = req.userID;
    const orderList = await Order.findAll({where:{userID:userId}});
    if(orderList){
      res.status(200).json({orders:orderList})
    }
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

//Controller to view the details of an individual order
const orderDetails = async function(req,res){
  try{
    const userId = req.userID;
    const orderId = req.body.orderID;
    const userOrder = await Order.findOne({where:{orderID:orderId,userID:userId}})
    const orderItems = await OrderItem.findAll({where:{orderID:orderId}})
    if(userOrder && orderItems){
      return res.status(200).json({order:userOrder,items:orderItems})
    }
    else{
      res.status(400).json({message:"Unable to fetch the order details!"})
    }
  } 
  catch(error){
    res.status(500).json({error:error.message})
  }
}

//Controller to perform the elastic Search
const Search = async function(req,res){
  try {
    const searchTerm = req.body.search;
    const searchOutput = await eSearch.searchData(searchTerm);
    if(searchOutput){
      res.status(200).json({result:searchOutput})
    }
    else{
      res.status(400).json({message:"No such item found!"})
    }
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}

module.exports = {
  signup,
  login,
  singleProduct,
  addProduct,
  addToCart,
  checkoutCart,
  placeOrder,
  allOrders,
  orderDetails,
  Search
};
