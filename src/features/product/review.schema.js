import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // rating: {
    //     type: Number,
    //     min: 1,
    //     max: 5,
    //     required: true,
    // },
    // comment: {
    //     type: String,
    //     maxLength: [200, "Comment cannot exceed 200 characters"],
    // },
});