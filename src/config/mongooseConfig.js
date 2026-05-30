import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";
dotenv.config();
const url = process.env.DB_URL;
export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected using Mongoose");
    await addCategories();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
async function addCategories() {
  const CategoryModel = mongoose.model("Category", categorySchema);
  const catefories = await CategoryModel.find();
  if (catefories.length === 0) {
    const categoriesToAdd = [
      { name: "Clothing" },
      { name: "Electronics" },
      { name: "Books" },
      { name: "Home & Kitchen" }
    ];
    await CategoryModel.insertMany(categoriesToAdd);
    console.log("Categories added successfully");
  } else {
    console.log("Categories already exist, skipping seeding");
    }
}