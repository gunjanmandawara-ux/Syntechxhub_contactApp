import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot be longer than 100 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot be longer than 254 characters."],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits."],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot be longer than 500 characters."],
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
