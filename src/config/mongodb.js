import { MongoClient } from "mongodb";

const url = process.env.DB_URL || "mongodb://localhost:27017/ecomdb";
let client;

export const connectToMongoDB = () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("Connected to MongoDB");
      createCounter(client.db());
      createIndexes(client.db()); // ← fixed typo
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

export const getDB = () => {
  return client.db();
};

export const getClient = () => {
  return client;
};

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemID" });
  if (!existingCounter) {
    await db
      .collection("counters")
      .insertOne({ _id: "cartItemID", sequence_value: 0 });
  }
};

const createIndexes = async (db) => {
  // ← fixed typo
  try {
    await db.collection("products").createIndex({ price: 1 });
    await db.collection("products").createIndex({ name: 1, category: -1 });
    await db.collection("products").createIndex({ desc: "text" });
    console.log("Indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
};
