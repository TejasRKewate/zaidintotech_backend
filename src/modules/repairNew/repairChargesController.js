import newRepair from "./newrepair.model.js";

// @desc    Add a new line-item charge to a repair
// @route   POST /api/newRepair/:repairId/charges
// @access  Private (Technician)
export const addRepairCharge = async (req, res) => {
    try {
        const { repairId } = req.params;
        const { description, amount } = req.body;

        // 1. Validation
        if (!description || description.trim() === "" || amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "Charge description and valid amount are required",
            });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number",
            });
        }

        // 2. Fetch repair
        const repair = await newRepair.findById(repairId);
        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair order not found",
            });
        }

        // 3. Ensure charges array exists
        if (!Array.isArray(repair.charges)) {
            repair.charges = [];
        }

        // 4. Push new charge item
        repair.charges.push({
            description: description.trim(),
            amount: numericAmount,
        });

        // 5. Recalculate totalCharges if your schema has this field
        repair.totalCharges = repair.charges.reduce(
            (sum, item) => sum + (Number(item.amount) || 0),
            0
        );

        // 6. Save with validation bypass for unmodified fields (prevents legacy schema errors)
        await repair.save({ validateModifiedOnly: true });

        return res.status(201).json({
            success: true,
            message: "Charge added successfully",
            charges: repair.charges,
            totalCharges: repair.totalCharges,
        });
    } catch (error) {
        console.error("ADD CHARGE ERROR DETAILS:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add repair charge",
            error: error.message,
        });
    }
};

// @desc    Update an existing charge item
// @route   PUT /api/newRepair/:repairId/charges/:chargeId
// @access  Private (Technician)
export const updateRepairCharge = async (req, res) => {
    try {
        const { repairId, chargeId } = req.params;
        const { description, amount } = req.body;

        const repair = await newRepair.findById(repairId);
        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair order not found",
            });
        }

        const chargeItem = repair.charges.id(chargeId);
        if (!chargeItem) {
            return res.status(404).json({
                success: false,
                message: "Charge line-item not found",
            });
        }

        if (description && description.trim() !== "") {
            chargeItem.description = description.trim();
        }

        if (amount !== undefined && amount !== null) {
            const numericAmount = Number(amount);
            if (isNaN(numericAmount) || numericAmount < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a positive number",
                });
            }
            chargeItem.amount = numericAmount;
        }

        await repair.save();

        return res.status(200).json({
            success: true,
            message: "Charge updated successfully",
            charges: repair.charges,
            totalCharges: repair.totalCharges,
        });
    } catch (error) {
        console.error("UPDATE CHARGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update repair charge",
            error: error.message,
        });
    }
};

// @desc    Delete a charge item from a repair
// @route   DELETE /api/newRepair/:repairId/charges/:chargeId
// @access  Private (Technician)
export const deleteRepairCharge = async (req, res) => {
    try {
        const { repairId, chargeId } = req.params;

        const repair = await newRepair.findById(repairId);
        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair order not found",
            });
        }

        const chargeItem = repair.charges.id(chargeId);
        if (!chargeItem) {
            return res.status(404).json({
                success: false,
                message: "Charge line-item not found",
            });
        }

        repair.charges.pull({ _id: chargeId });
        await repair.save();

        return res.status(200).json({
            success: true,
            message: "Charge removed successfully",
            charges: repair.charges,
            totalCharges: repair.totalCharges,
        });
    } catch (error) {
        console.error("DELETE CHARGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete repair charge",
            error: error.message,
        });
    }
};


// @desc    Track repair status and billing details by Repair/Ticket Number
// @route   GET /api/newRepair/track/:ticketNumber
// @access  Public
export const trackRepairByTicket = async (req, res) => {
    try {
        const { ticketNumber } = req.params;

        if (!ticketNumber || ticketNumber.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Ticket number is required",
            });
        }

        // Case-insensitive exact match for repairNumber
        const repair = await newRepair.findOne({
            repairNumber: { $regex: new RegExp(`^${ticketNumber.trim()}$`, "i") },
        }).select("-__v");

        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "No repair order found with that ticket number",
            });
        }

        return res.status(200).json({
            success: true,
            repair,
        });
    } catch (error) {
        console.error("TRACK REPAIR ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch repair details",
            error: error.message,
        });
    }
};

// @desc    Track repair status and billing details by Repair/Ticket Number
// @route   GET /api/newRepair/track/:ticketNumber
// @access  Public
// export const trackRepairByTicket = async (req, res) => {
//     try {
//         const { ticketNumber } = req.params;

//         if (!ticketNumber || ticketNumber.trim() === "") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Ticket number is required",
//             });
//         }

//         // Case-insensitive exact match for repairNumber
//         const repair = await newRepair.findOne({
//             repairNumber: { $regex: new RegExp(`^${ticketNumber.trim()}$`, "i") },
//         }).select("-__v");

//         if (!repair) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No repair order found with that ticket number",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             repair,
//         });
//     } catch (error) {
//         console.error("TRACK REPAIR ERROR:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch repair details",
//             error: error.message,
//         });
//     }
// };