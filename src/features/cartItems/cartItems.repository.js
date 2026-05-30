import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  // Add item to cart
  async add(productID, userID, quantity) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      // Check if product already exists in cart
      const existingCartItem = await collection.findOne({
        productID: new ObjectId(productID),

        userID: new ObjectId(userID),
      });

      // If exists increase quantity
      if (existingCartItem) {
        return await collection.updateOne(
          {
            productID: new ObjectId(productID),

            userID: new ObjectId(userID),
          },
          {
            $inc: {
              quantity: Number(quantity),
            },
          },
        );
      }

      // Generate custom sequence ID
      const id = await this.getNextSequenceValue();

      // Create new cart item
      const cartItem = {
        _id: id,

        productID: new ObjectId(productID),

        userID: new ObjectId(userID),

        quantity: Number(quantity),
      };

      // Insert new item
      return await collection.insertOne(cartItem);
    } catch (error) {
      console.log("Error adding cart item:", error);

      throw new ApplicationError("Error adding cart item", 500);
    }
  }

  // Get all cart items of user
  async get(userID) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const cartItems = await collection
        .find({
          userID: new ObjectId(userID),
        })
        .toArray();

      return cartItems;
    } catch (error) {
      console.error("Error fetching cart items:", error);

      throw new ApplicationError("Error fetching cart items", 500);
    }
  }

  // Update quantity manually
  async update(userID, productID, quantity) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const result = await collection.updateOne(
        {
          userID: new ObjectId(userID),

          productID: new ObjectId(productID),
        },
        {
          $set: {
            quantity: Number(quantity),
          },
        },
      );

      return result;
    } catch (error) {
      console.error("Error updating cart item:", error);

      throw new ApplicationError("Error updating cart item", 500);
    }
  }

  // Delete cart item
  async delete(userID, cartItemID) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const result = await collection.deleteOne({
        _id: Number(cartItemID),

        userID: new ObjectId(userID),
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting cart item:", error);

      throw new ApplicationError("Error deleting cart item", 500);
    }
  }

  // Generate auto increment sequence
  async getNextSequenceValue() {
    try {
      const db = getDB();

      const counters = db.collection("counters");

      const result = await counters.findOneAndUpdate(
        {
          _id: "cartItemID",
        },
        {
          $inc: {
            sequence_value: 1,
          },
        },
        {
          upsert: true,

          returnDocument: "after",
        },
      );

      return result.sequence_value;
    } catch (error) {
      console.error("Error generating sequence:", error);

      throw new ApplicationError("Error generating cart item ID", 500);
    }
  }
}
