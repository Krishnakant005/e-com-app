import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "./user.model.js";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }
  async signUp(name, email, password, type) {
    try {
      const db = getDB();
      const usersCollection = db.collection(this.collection);
      const newUser = { name, email, password, type };
      const result = await usersCollection.insertOne(newUser);
      const createdUser = new UserModel(name, email, password, type);
      createdUser.id = result.insertedId;
      return createdUser;
    } catch (error) {
      throw new ApplicationError(error.message, 500);
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();
      const usersCollection = db.collection(this.collection);
      return await usersCollection.findOne({ email });
    } catch (error) {
      throw new ApplicationError(error.message, 500);
    }
  }

  async getAllUsers() {
    try {
      const db = getDB();
      const usersCollection = db.collection(this.collection);
      const users = await usersCollection.find().toArray();
      return users.map(
        (user) =>
          new UserModel(
            user.name,
            user.email,
            user.password,
            user.type,
            user._id,
          ),
      );
    } catch (error) {
      throw new ApplicationError(error.message, 500);
    }
  }
}
