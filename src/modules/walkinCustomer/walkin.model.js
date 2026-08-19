import mongoose from "mongoose"

const walkInCustomerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        loyaltyPoints: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const WalkInCustomer = mongoose.model("WalkInCustomer", walkInCustomerSchema);
export default WalkInCustomer;