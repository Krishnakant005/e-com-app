//1.import express
//import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import userRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import apiDocs from "./swagger.json" with { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
//2.create an express server
const server = express();
//load all environment variables from .env file
//dotenv.config();
//CORS policy configuration
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
// var corsOptions = {
//   origin: "http://localhost:5500",
//   optionsSuccessStatus: 200, // For legacy browser support
// };
server.use(cors());
server.use(cors(corsOptions));
server.use(express.json());
//server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use("/api/orders", jwtAuth, orderRouter);
// for all requests related to product, redirect to product routes.
server.use("/api/cartItems", jwtAuth, cartRouter);
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", userRouter);
console.log("registering like router");
server.use("/api/likes", jwtAuth, likeRouter);
//3.create a request handler for the default home page
server.get("/", (req, res) => {
  res.send("Welcome to ecommerce API");
});
server.use((req, res) => {
  res.status(404).send("API not found");
});
//4.ERROR HANDLING MIDDLEWARE
server.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send({
      success: false,
      message: "Validation error",
      error: err.message,
    });
  }
  // Custom application errors
  else if (err instanceof ApplicationError) {
    return res.status(err.statusCode).send({
      success: false,
      message: err.message,
    });
  }
  // Unknown server errors
  return res.status(500).send({
    success: false,
    message: "Something went wrong",
    error: err.message,
  });
});
//5. create a request handler for incorrect routes
server.use((req, res) => {
  res.status(404).send("API not found");
});
//6.start the server
// connectToMongoDB();
const PORT = process.env.PORT || 3200;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectUsingMongoose();
});
