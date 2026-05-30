import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "type",
  },
  type: {
    type: String,
    enum: ["Product", "Category"],
    required: true,
  },
}).pre("save",() => {
  console.log("New like being saved:");

}).post("save", (docs) => {
  console.log("Like saved successfully:");
  console.log("Saved like document:", docs);
}).pre('find',() => {
  console.log("Finding likes with query:");
  console.log("Finding likes with options:");
 
});
// }).pre("remove", () => {
//   console.log("Like being removed:", this);
// }).post("remove", () => {
//   console.log("Like removed successfully:", this);
// });