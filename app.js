import express from "express";
import { mongoDb } from "./data/connection.js";
import { ErrorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";
import cartProductRouter from "./routes/cartProduct.js";
import { Product } from "./models/product.js";
import { config } from "dotenv";
import cors from "cors";

const app = express();
config({
  path: "./.env",
});

mongoDb;

app.use(express.json());
app.use(cookieParser());
// Use cors middleware with specific options
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the allowed origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers)
  })
);

app.get("/", (req, res) => {
  res.send("hii");
});

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.use("/users", userRouter);
app.use("/cart", cartProductRouter);

app.use(ErrorMiddleware);

app.listen(process.env.PORT, (req, res) => {
  console.log("Server is listening...");
});
