// models/product.js

import mongoose from "mongoose";

// Define the schema for the product
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
});

// Create a Mongoose model for the product collection
export const Product = mongoose.model("Product", productSchema);
