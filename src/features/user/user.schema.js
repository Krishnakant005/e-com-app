import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name cannot exceed 25 characters"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    unique: true,
  },
  password: {
    type: String,
    // validate: {
    //     validator: function(v) {
    //         return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(v);
    //     },
    //     message: "Password must contain at least one letter and one number"
    // },
    required: true,
  },
  type: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
});