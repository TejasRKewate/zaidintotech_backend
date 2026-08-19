import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Received",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Received",
    },

    estimatedCompletionDate: {
      type: Date,
    },

    repairCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    technicianName: {
      type: String,
      trim: true,
      default: "",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Repair = mongoose.model("Repair", repairSchema);
export default Repair;