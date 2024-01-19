import mongoose from "mongoose";

export const mongoDb = mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "E-Commerce",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));
