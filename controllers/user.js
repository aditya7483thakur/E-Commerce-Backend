import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middlewares/error.js";
import { sendCookie } from "../utils/features.js";
import { stripe } from "../app.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler("User Already Exist", 404));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    sendCookie(user, res, `Welcome Back ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

export const CreateCheckoutSession = async (req, res) => {
  try {
    const productsArray = req.body.products;
    const lineItems = [];

    for (const productItem of productsArray) {
      const product = await stripe.products.create({
        name: productItem.title,
        images: [productItem.image],
      });

      if (product) {
        const price = await stripe.prices.create({
          product: `${product.id}`,
          unit_amount: productItem.price * 100,
          currency: "usd",
        });

        if (price.id) {
          lineItems.push({
            price: price.id,
            quantity: productItem.amount,
          });
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      return_url: `http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    return res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
  }
};

export const SessionStatus = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    return res.send({
      status: session.status,
    });
  } catch (error) {
    console.log(error);
  }
};
