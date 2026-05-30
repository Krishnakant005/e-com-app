import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userID) {
    try {
      const db = getDB();

      const items = await this.getCartItems(userID);
      if (!items || items.length === 0) {
        throw new ApplicationError("Cart is empty. Cannot place order.", 400);
      }

      const totalAmount = items.reduce((sum, item) => {
        return sum + item.quantity * item.productInfo.price;
      }, 0);

      const collection = db.collection(this.collection);
      const newOrder = new OrderModel(
        new ObjectId(userID),
        totalAmount,
        new Date(),
      );
      await collection.insertOne(newOrder);

      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
          );
      }

      await db
        .collection("cartItems")
        .deleteMany({ userID: new ObjectId(userID) });

      return newOrder;
    } catch (error) {
      console.log("placeOrder", error); // ← real error
      if (error instanceof ApplicationError) throw error;
      throw new ApplicationError("Error occurred while placing order", 500);
    }
  }

  async getCartItems(userID) {
    try {
      const db = getDB();
      const items = await db
        .collection("cartItems")
        .aggregate([
          { $match: { userID: new ObjectId(userID) } },
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
        ])
        .toArray();

      return items;
    } catch (error) {
      console.log("getCartItems", error); // ← real error
      throw new ApplicationError(
        "Error occurred while fetching cart items",
        500,
      );
    }
  }

  async getTotalAmount(userID) {
    try {
      const db = getDB();
      const result = await db
        .collection("cartItems")
        .aggregate([
          { $match: { userID: new ObjectId(userID) } },
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $group: {
              _id: null,
              totalAmount: {
                $sum: { $multiply: ["$quantity", "$productInfo.price"] },
              },
            },
          },
        ])
        .toArray();

      return result.length > 0 ? result[0].totalAmount : 0;
    } catch (error) {
      console.log("getTotalAmount", error); // ← real error
      throw new ApplicationError(
        "Error occurred while fetching total amount",
        500,
      );
    }
  }
}
