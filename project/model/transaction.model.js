const mongoose = require("mongoose");

const services = ["recharge", "facebook", "instagram", "purchase"];
const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    amountEquivalent: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["recharge", "purchase"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["EDAHABIA", "CIB", "VISA", "MASTERCARD"],
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
