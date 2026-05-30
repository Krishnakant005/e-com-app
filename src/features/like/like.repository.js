import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { productSchema } from "../product/product.schema.js";
import { categorySchema } from "../product/category.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

const LikeModel = mongoose.model("Like", likeSchema);
const ProductModel = mongoose.model("Product", productSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

export class LikeRepository {
  async likeItem(userID, itemID, type) {
    try {
      const existingLike = await LikeModel.findOne({ userID, itemID, type });
      if (existingLike) {
        await LikeModel.deleteOne({ _id: existingLike._id });
        return { success: true, message: `${type} unliked successfully` };
      }
      const newLike = new LikeModel({ userID, itemID, type });
      await newLike.save();
      return { success: true, message: `${type} liked successfully` };
    } catch (error) {
      console.error("Error liking item:", error);
      throw new ApplicationError("Error liking item: " + error.message, 500);
    }
  }

  async getProductById(productID) {
    try {
      return await ProductModel.findById(productID);
    } catch (error) {
      throw new ApplicationError(
        "Error fetching product: " + error.message,
        500,
      );
    }
  }

  async getCategoryById(categoryID) {
    try {
      return await CategoryModel.findById(categoryID);
    } catch (error) {
      throw new ApplicationError(
        "Error fetching category: " + error.message,
        500,
      );
    }
  }

  async getLikes(userID) {
    try {
      const likes = (
        await LikeModel.find({ userID }).populate("itemID")
      );
      return likes;
    } catch (error) {
      throw new ApplicationError("Error fetching likes: " + error.message, 500);
    }
  }
}
