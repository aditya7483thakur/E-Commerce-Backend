import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  CreateCheckoutSession,
  SessionStatus,
  getMyProfile,
  login,
  logout,
  register,
} from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getMyProfile", isAuthenticated, getMyProfile);
router.get("/logout", logout);
router.post("/create-checkout-session", isAuthenticated, CreateCheckoutSession);
router.get("/session-status", isAuthenticated, SessionStatus);

export default router;
