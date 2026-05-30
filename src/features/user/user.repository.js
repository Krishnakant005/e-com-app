import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

//creting model for schema
const userModel = mongoose.model("User", userSchema);

export default class UserRepository {
    constructor() {
        this.model = userModel;
    }   
    async resetPassword(userID, newPassword) {
    try {
      const user = await this.model.findById(userID);
      if (!user) {
        throw new ApplicationError( "User not found",   404   );
      }
      user.password = newPassword;
      await user.save();
      return user;
    }  catch (error) {
            console.error("Error resetting password for user:", userID, error);
            throw new ApplicationError("Error resetting password: " + error.message, 500);
        }
    }

    async signUp(user) {
        try {
            const newUser = new this.model(user);
            return await newUser.save();
        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                console.error("Validation error signing up user:", error);
                throw new ApplicationError("Validation error: " + error.message, 400);
            }else {
                console.error("Error signing up user:", error);
                throw new ApplicationError("Error signing up user: " + error.message, 500);
            }
        }   
}

     async signIn(email, password) {
        try {
            const user = await this.model.findOne({ email });
            if (!user) {
                console.error("User not found with email:", email);
                throw new ApplicationError("User not found", 404);
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                console.error("Invalid credentials for user:", email);
                throw new ApplicationError("Invalid credentials", 401);
            }
            return user;
        } catch (error) {
            console.error("Error signing in user:", error);
            throw new ApplicationError("Error signing in user: " + error.message, 500);
        }
    }
    async findByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new ApplicationError("Error finding user by email: " + error.message, 500);
        }   
    }
}