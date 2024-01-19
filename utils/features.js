import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  res
    .status(statusCode)
    .cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000 * 3,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    })
    .json({
      success: true,
      message,
    });
};
