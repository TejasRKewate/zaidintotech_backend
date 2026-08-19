const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    rentalStatus: {
      type: String,
      enum: [
        "Booked",
        "Active",
        "Returned",
        "Cancelled",
        "Late",
      ],
      default: "Booked",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Refunded",
      ],
      default: "Pending",
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    isReturned: {
      type: Boolean,
      default: false,
    },

    returnedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rental", rentalSchema);