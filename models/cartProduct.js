// models/product.js

import mongoose from "mongoose";

// Define the schema for the product
const CartProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  amount: { type: Number, default: 0 },
});

// Create a Mongoose model for the product collection
export const CartProduct = mongoose.model("CartProduct", CartProductSchema);
