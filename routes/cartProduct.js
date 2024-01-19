import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addToCart,
  amount,
  cartProducts,
  clearCart,
  deleteCartItem,
} from "../controllers/cartProduct.js";

const router = express.Router();

router.get("/cartProducts", isAuthenticated, cartProducts);
router.post("/addToCart/:id", isAuthenticated, addToCart);
router.put("/amount/:id/:action", isAuthenticated, amount);
router.delete("/deleteCartItem/:id", isAuthenticated, deleteCartItem);
router.delete("/clear-cart", isAuthenticated, clearCart);

export default router;
