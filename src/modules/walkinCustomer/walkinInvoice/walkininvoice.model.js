const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, required: true, unique: true },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "WalkInOrder", required: true },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "WalkInCustomer", required: true },
        amountDue: { type: Number, required: true },
        amountPaid: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "partially_paid", "paid", "refunded"],
            default: "unpaid",
        },
        paymentDetails: {
            method: {
                type: String,
                enum: ["CASH", "UPI", "SPLIT"],
                required: true,
            },
            cashAmount: { type: Number, default: 0 },
            upiAmount: { type: Number, default: 0 },
            upiTransactionId: { type: String, trim: true }, // Optional reference/UTR number
        },
        issuedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const walkInInvoice = mongoose.model("walkInInvoice", invoiceSchema);
export default walkInInvoice;