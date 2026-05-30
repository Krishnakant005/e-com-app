import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    // In a real application, you would inject the repository here
    this.productRepository = new ProductRepository();
  }
  async getAllProducts(req, res, next) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }

  async addProduct(req, res, next) {
    try {
      console.log("headers:", req.headers["content-type"]);
      console.log("body:", req.body);
      console.log("file:", req.file);

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send("No data received");
      }

      const { name, description, categories, price, sizes } = req.body;

      const newProduct = {
        name,
        description,
        categories,
        price: price ? parseFloat(price) : undefined,
        sizes: sizes ? sizes.split(",") : [],
        imageUrl: req.file ? req.file.filename : null,
      };

      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    } catch (error) {
      next(error);
    }
  }
  async rateProduct(req, res, next) {
    try {
      const userID = req.userID;
      const productID = req.body.productID;
      const rating = Number(req.body.rating);
      const result = await this.productRepository.rateProduct(
        userID,
        productID,
        rating,
      );
      res.status(200).send(result);
    } catch (error) {
      console.error("Error rating product:", error);
      next(error); // ← let error middleware handle it
    }
  }

  async getOneProduct(req, res, next) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  }

  async filterProduct(req, res, next) {
    try {
      const minPrice = parseFloat(req.query.minPrice);
      // const maxPrice = parseFloat(req.query.maxPrice);
      const categories = req.query.categories;
      const result = await this.productRepository.filter(minPrice, categories);
      res.status(200).send(result);
    } catch (error) {
      console.error("Error filtering products:", error);
      next(error);
    }
  }
  async avergePrice(req, res, next) {
    try {
      const category = req.query.category;
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (error) {
      console.error("Error calculating average price:", error);
      next(error);
    }
  }
} 