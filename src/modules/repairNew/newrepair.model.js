import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});




const repairSchema = new mongoose.Schema(
    {
        // Unique repair/job number
        repairNumber: {
            type: String,
            unique: true,
            index: true,
        },

        // Registered customer - OPTIONAL
        // A walk-in customer may not have an account.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // Registered product - OPTIONAL
        // Walk-in laptop may not exist in Product collection.
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null,
        },

        // CUSTOMER INFORMATION


        customerName: {
            type: String,
            required: true,
            trim: true,
        },

        customerPhone: {
            type: String,
            required: true,
            trim: true,
        },


        // LAPTOP INFORMATION

        laptopModel: {
            type: String,
            required: true,
            trim: true,
        },


        // REPAIR INFORMATION


        issueDescription: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Received",
                "Assigned",
                "In Progress",
                "Waiting for Parts",
                "Ready for Delivery",
                "Completed",
                "Cancelled",
            ],
            default: "Received",
        },

        // Technician assigned to repair
        assignedTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        technicianName: {
            type: String,
            trim: true,
            default: "",
        },

        // REPAIR COST


        estimatedCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        repairCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        charges: [chargeSchema],
        totalCharges: {
            type: Number,
            default: 0,
        },

        // DATES


        estimatedCompletionDate: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },


        // REMARKS


        remarks: {
            type: String,
            trim: true,
            default: "",
        },

        technicianRemarks: {
            type: String,
            trim: true,
            default: "",
        },

        // DELIVERY


        isDelivered: {
            type: Boolean,
            default: false,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },

        // RECEPTIONIST

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const newRepair = mongoose.model("newRepair", repairSchema);

export default newRepair;