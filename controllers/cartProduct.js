import ErrorHandler from "../middlewares/error.js";
import { CartProduct } from "../models/cartProduct.js";

export const cartProducts = async (req, res, next) => {
  try {
    const id = req.user._id;
    const cartItems = await CartProduct.find({ user: id }).populate("product");

    const formattedCartItems = cartItems.map((item) => {
      return {
        amount: item.amount,
        _id: item.product._id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
      };
    });

    res.json(formattedCartItems);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartItem = await CartProduct.findOne({
      product: id,
      user: req.user._id,
    });
    if (cartItem) {
      cartItem.amount += 1;
      await cartItem.save();
      res.json({
        success: true,
        message: "Added to Cart",
      });
    } else {
      const added = await CartProduct.create({
        product: id,
        amount: 1,
        user: req.user._id,
      });
      res.json({
        success: true,
        message: "Added to Cart",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const amount = async (req, res, next) => {
  try {
    const { id, action } = req.params;

    const cartItem = await CartProduct.findOne({
      product: id,
      user: req.user._id,
    });

    if (!cartItem) {
      return next(new ErrorHandler("Invalid Id", 404));
    }

    if (action === "increment") {
      cartItem.amount += 1;
    } else if (action === "decrement" && cartItem.amount > 1) {
      cartItem.amount -= 1;
    } else {
      return next(new ErrorHandler("Invalid action or amount", 400));
    }

    await cartItem.save();

    res.json({
      success: true,
      message: "Amount updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartItem = await CartProduct.findOne({
      product: id,
      user: req.user._id,
    });

    if (!cartItem) {
      return next(new ErrorHandler("Invalid Id", 404));
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const clearCart = await CartProduct.deleteMany({
      user: req.user._id,
    });

    if (clearCart.deletedCount === 0) {
      return next(new ErrorHandler("Nothing to clear !", 400));
    }

    return res.status(200).json({
      success: true,
      message: "Cart Cleared",
    });
  } catch (error) {
    next(error);
  }
};
