import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true
    },
    description: {
        type: String
       
    },
    price: {    
        type: Number,
        required: true
    },  
    category: {
        type: String
       
    },
    imageUrl: {
        type: String
       
    },
    stock: {    
        type: Number
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }]
});