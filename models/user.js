import mongoose from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneNumber = parsePhoneNumberFromString(value, "IN");
        return phoneNumber ? phoneNumber.isValid() : false;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", schema);
