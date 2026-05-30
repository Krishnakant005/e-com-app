import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const reviewModel = mongoose.model("Review", reviewSchema);
const categoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      //1. get the db
      // const db = getDB();
      // //2. get the collection
      // const collection = db.collection(this.collection);
      // //3. insert the product in the collection
      // const result = await collection.insertOne(newProduct);
      // return result;
        console.log("typeof categories:", typeof newProduct.categories);
        console.log("categories value:", newProduct.categories);
      newProduct.categories = newProduct.categories
        ? newProduct.categories.split(",").map((e) => e.trim())
        : [];

      const product = new ProductModel(newProduct);
      const savedProduct = await product.save();

      await categoryModel.updateMany(
        { _id: { $in: newProduct.categories.map((id) => new ObjectId(id)) } },
        { $push: { products: new ObjectId(savedProduct._id) } },
      );
      return savedProduct;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Error adding product", 500);
    }
  }
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const products = await collection.find().toArray();
      return products;
    } catch (error) {
      throw new ApplicationError("Error fetching products", 500);
    }
  }
  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const product = await collection.findOne({ _id: new ObjectId(id) });
      return product;
    } catch (error) {
      throw new ApplicationError("Error fetching product", 500);
    }
  }
  async filter(minPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};

      if (!isNaN(minPrice)) {
        filterExpression.price = { $gte: Number(minPrice) };
      }
      categories = JSON.parse(categories.replace(/'/g, '"')); // Convert string to array
      if (categories) {
        filterExpression = {
          $and: [
            { category: { $in: categories } },
            { price: filterExpression.price || { $gte: 0 } },
          ],
        };
      }

      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, rating: { slice: 1 } })
        .toArray();
    } catch (error) {
      console.error("REAL ERROR:", error);
      throw new ApplicationError("Error filtering products", 500);
    }
  }
  async rateProduct(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const productToUpdate = await collection.findOne({
        _id: new ObjectId(productID),
      });

      if (!productToUpdate) {
        throw new ApplicationError("Product not found", 404);
      }

      const userReview = await reviewModel.findOne({
        productID: new ObjectId(productID),
        userID: new ObjectId(userID),
      });

      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new reviewModel({
          productID: new ObjectId(productID),
          userID: new ObjectId(userID),
          rating: Number(rating),
        });
        await newReview.save();
      }

      return { success: true, message: "Rating added successfully" };
    } catch (error) {
      console.log("REAL ERROR:", error);
      if (error instanceof ApplicationError) throw error;
      throw new ApplicationError("Error rating product", 500);
    }
  }
  async rateProduct(userID, productID, rating) {
    try {
      const productToUpdate = await ProductModel.findById(productID);

      if (!productToUpdate) {
        throw new ApplicationError("Product not found", 404);
      }

      const userReview = await reviewModel.findOne({
        productID: new ObjectId(productID),
        userID: new ObjectId(userID),
      });

      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new reviewModel({
          productID: new ObjectId(productID),
          userID: new ObjectId(userID),
          rating: Number(rating),
        });
        await newReview.save();
      }

      return { success: true, message: "Rating added successfully" };
    } catch (error) {
      console.log("REAL ERROR:", error);
      if (error instanceof ApplicationError) throw error;
      throw new ApplicationError("Error rating product", 500);
    }
  }
  // async rateProduct(userID, productID, rating) {
  //   try {
  //     const productToUpdate = await this.get(productID);
  //     if (!productToUpdate) {
  //       console.error("Product not found with ID:", productID);
  //       throw new ApplicationError("Product not found", 404);
  //     }
  //     const userReview =await reviewModel.findOne({ productID: new ObjectId(productID), userID: new ObjectId(userID) });
  //    if(userReview){
  //       userReview.rating = rating;
  //       await userReview.save();
  //    } else {
  //       const newReview = new reviewModel({ productID: new ObjectId(productID), userID: new ObjectId(userID), rating : Number(rating) });
  //       await newReview.save();
  //    } return {
  //      success: true,
  //      message: "Rating added successfully",
  //    };
  //   }
  //   //   const db = getDB();
  //   //   const collection = db.collection(this.collection);

  //   //   // 1. find the product
  //   //   const product = await collection.findOne({
  //   //     _id: new ObjectId(productID),
  //   //   });
  //   //   if (!product) {
  //   //     throw new ApplicationError("Product not found", 404);
  //   //   }

  //   //   // 2. remove existing rating if any
  //   //   await collection.updateOne(
  //   //     { _id: new ObjectId(productID) },
  //   //     { $pull: { ratings: { userID } } }, // ← remove old rating
  //   //   );

  //   //   // 3. add new rating
  //   //   await collection.updateOne(
  //   //     { _id: new ObjectId(productID) },
  //   //     { $push: { ratings: { userID, rating: Number(rating) } } },
  //   //   );

  //   //   // 4. return updated product
  //   //   return await collection.findOne({ _id: new ObjectId(productID) });
  //   // }
  //   catch (error) {
  //     console.log("REAL ERROR:", error);
  //     if (error instanceof ApplicationError) throw error;
  //     throw new ApplicationError("Error rating product", 500);
  //   }
  // }
  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const result = await collection
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
      return result;
    } catch (error) {
      console.error("Error calculating average price:", error);
      throw new ApplicationError("Error calculating average price", 500);
    }
  }
}
export default ProductRepository;
