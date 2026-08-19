const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    taxRate: { type: Number, default: 0 }, // e.g. 18 for 18% GST
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
});

const walkInOrderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "WalkInCustomer", required: true },
        receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        subtotal: { type: Number, required: true },
        discountTotal: { type: Number, default: 0 },
        taxTotal: { type: Number, default: 0 },
        grandTotal: { type: Number, required: true },
        status: {
            type: String,
            enum: ["draft", "pending_payment", "completed", "cancelled"],
            default: "pending_payment",
        },
    },
    { timestamps: true }
);

const walkInOrder = mongoose.model("WalkInOrder", walkInOrderSchema);
export default walkInOrder;