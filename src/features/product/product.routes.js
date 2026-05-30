// Manages routes/ paths to products

import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

// initialize express router
const productRouter = express.Router();
const productController = new ProductController();

// routes
productRouter.get("/", (req, res, next) => productController.getAllProducts(req, res, next));
productRouter.post(
  "/",
 upload.single("imageUrl"),
(req, res, next) => productController.addProduct(req, res, next)    
);
//http://localhost:3200/api/products/filter?minPrice=1000&maxPrice=40000&category=Eletronics
productRouter.get('/filter', (req, res, next) => productController.filterProduct(req, res, next));
productRouter.post("/rate", (req, res, next) => productController.rateProduct(req, res, next));

productRouter.get("/averagePrice", (req, res, next) =>
  productController.avergePrice(req, res, next),
);
productRouter.get("/:id", (req, res, next) =>
  productController.getOneProduct(req, res, next),
);
export default productRouter;
