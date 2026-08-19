import mongoose from 'mongoose'
import newRepair from './newrepair.model.js'
import User from '../users/user.model.js'
import Product from '../products/product.model.js'

//Generate Repair Number

const generateRepairNumber = async () => {
    const year = new Date().getFullYear();

    const lastRepair = await newRepair
        .findOne({
            repairNumber: new RegExp(`^REP-${year}-`),
        })
        .sort({ createdAt: -1 })
        .select("repairNumber");

    let nextNumber = 1;

    if (lastRepair?.repairNumber) {
        const parts = lastRepair.repairNumber.split("-");
        const lastNumber = parseInt(parts[2], 10);

        if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    return `REP-${year}-${String(nextNumber).padStart(5, "0")}`;
};
// HELPER: POPULATE REPAIR
const populateRepair = (query) => {
    return query
        .populate(
            "user",
            "firstName lastName email phone"
        )
        .populate(
            "product",
            "name brand model category"
        )
        .populate(
            "assignedTechnician",
            "firstName lastName email phone role employeeId"
        )
        .populate(
            "createdBy",
            "firstName lastName email phone role"
        );
};

export const createRepair = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            laptopModel,
            assignedTechnician, // <--- Ensure this is destructured
            technicianName,
            issueDescription,
            remarks,
            user,
            product,
        } = req.body;


        // Basic validation


        if (!customerName) {
            return res.status(400).json({
                success: false,
                message: "Customer name is required",
            });
        }

        if (!customerPhone) {
            return res.status(400).json({
                success: false,
                message: "Customer phone number is required",
            });
        }

        if (!laptopModel) {
            return res.status(400).json({
                success: false,
                message: "Laptop model is required",
            });
        }

        if (!issueDescription) {
            return res.status(400).json({
                success: false,
                message: "Issue description is required",
            });
        }


        // Generate repair number

        const repairNumber = await generateRepairNumber();

        // Optional registered user

        let userId = null;

        if (user) {
            if (!mongoose.Types.ObjectId.isValid(user)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const existingUser = await User.findById(user);

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            userId = user;
        }

        // Optional registered product

        let productId = null;

        if (product) {
            if (!mongoose.Types.ObjectId.isValid(product)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID",
                });
            }

            const existingProduct = await Product.findById(product);

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            productId = product;
        }


        // --------------------------------------------------------
        // Create repair
        // --------------------------------------------------------

        const repair = await newRepair.create({
            repairNumber,

            user: userId,
            product: productId,

            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),

            laptopModel: laptopModel.trim(),

            issueDescription: issueDescription.trim(),

            remarks: remarks?.trim() || "",
            assignedTechnician: assignedTechnician || null,
            technicianName: technicianName || "",
            status: assignedTechnician ? "Assigned" : "Received",


            createdBy: req.user?._id || req.user?.id,
        });


        // --------------------------------------------------------
        // Return populated repair
        // --------------------------------------------------------

        const populatedRepair = await populateRepair(
            newRepair.findById(repair._id)
        );


        return res.status(201).json({
            success: true,
            message: "Repair request created successfully",
            repair: populatedRepair,
        });

    } catch (error) {
        console.error("CREATE REPAIR ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create repair request",
            error: error.message,
        });
    }
};



export const getAllRepairs = async (req, res) => {
    try {
        const {
            status,
            search,
            technician,
        } = req.query;


        // --------------------------------------------------------
        // Build filter
        // --------------------------------------------------------

        const filter = {};


        if (status) {
            filter.status = status;
        }


        if (technician) {
            if (!mongoose.Types.ObjectId.isValid(technician)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid technician ID",
                });
            }

            filter.assignedTechnician = technician;
        }


        // --------------------------------------------------------
        // Search
        // --------------------------------------------------------

        if (search) {
            filter.$or = [
                {
                    repairNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    customerName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    customerPhone: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    laptopModel: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }


        // --------------------------------------------------------
        // Fetch repairs
        // --------------------------------------------------------

        const repairs = await populateRepair(
            newRepair.find(filter).sort({ createdAt: -1 })
        );


        return res.status(200).json({
            success: true,
            count: repairs.length,
            repairs,
        });

    } catch (error) {
        console.error("GET ALL REPAIRS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch repairs",
            error: error.message,
        });
    }
};


//GET REPAIR BY ID
// GET /:id
export const getRepairById = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair ID",
            });
        }


        const repair = await populateRepair(
            newRepair.findById(id)
        );


        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair not found",
            });
        }


        return res.status(200).json({
            success: true,
            repair,
        });

    } catch (error) {
        console.error("GET REPAIR ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch repair",
            error: error.message,
        });
    }
};

// 4. GET REPAIRS BY USER
// GET /user/:userId
export const getRepairsByUser = async (req, res) => {
    try {
        const { userId } = req.params;


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }


        const repairs = await populateRepair(
            newRepair.find({
                user: userId,
            }).sort({
                createdAt: -1,
            })
        );


        return res.status(200).json({
            success: true,
            count: repairs.length,
            repairs,
        });

    } catch (error) {
        console.error("GET USER REPAIRS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user repairs",
            error: error.message,
        });
    }
};





// ============================================================
// 5. GET REPAIRS BY PRODUCT
// GET /product/:productId
// ============================================================

export const getRepairsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;


        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }


        const repairs = await populateRepair(
            newRepair.find({
                product: productId,
            }).sort({
                createdAt: -1,
            })
        );


        return res.status(200).json({
            success: true,
            count: repairs.length,
            repairs,
        });

    } catch (error) {
        console.error("GET PRODUCT REPAIRS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product repairs",
            error: error.message,
        });
    }
};


// ============================================================
// 6. UPDATE REPAIR
// PUT /:id
// ============================================================

export const updateRepair = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair ID",
            });
        }


        const allowedFields = [
            "customerName",
            "customerPhone",
            "laptopModel",
            "issueDescription",
            "estimatedCost",
            "repairCost",
            "estimatedCompletionDate",
            "remarks",
            "technicianRemarks",
        ];


        const updateData = {};


        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }


        const repair = await newRepair.findByIdAndUpdate(
            id,
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        );


        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair not found",
            });
        }


        const populatedRepair = await populateRepair(
            newRepair.findById(repair._id)
        );


        return res.status(200).json({
            success: true,
            message: "Repair updated successfully",
            repair: populatedRepair,
        });

    } catch (error) {
        console.error("UPDATE REPAIR ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update repair",
            error: error.message,
        });
    }
};




// ============================================================
// 7. UPDATE REPAIR STATUS / ASSIGN TECHNICIAN
// PATCH /:id/status
// ============================================================

export const updateRepairStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            assignedTechnician,
            technicianRemarks,
            repairCost,
            estimatedCompletionDate,
        } = req.body;


        // --------------------------------------------------------
        // Validate repair ID
        // --------------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair ID",
            });
        }


        // --------------------------------------------------------
        // Find repair
        // --------------------------------------------------------

        const repair = await newRepair.findById(id);

        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair not found",
            });
        }


        // --------------------------------------------------------
        // Validate technician
        // --------------------------------------------------------

        if (assignedTechnician) {
            if (!mongoose.Types.ObjectId.isValid(assignedTechnician)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid technician ID",
                });
            }


            const technician = await User.findById(
                assignedTechnician
            );

            if (!technician) {
                return res.status(404).json({
                    success: false,
                    message: "Technician not found",
                });
            }


            // If your User model uses role
            if (
                technician.role &&
                technician.role.toUpperCase() !== "TECHNICIAN"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Selected user is not a technician",
                });
            }


            repair.assignedTechnician = assignedTechnician;

            repair.technicianName =
                `${technician.firstName || ""} ${technician.lastName || ""}`
                    .trim();
        }


        // --------------------------------------------------------
        // Update status
        // --------------------------------------------------------

        if (status) {
            repair.status = status;


            if (status === "Completed") {
                repair.completedAt = new Date();
            }
        }


        // --------------------------------------------------------
        // Technician remarks
        // --------------------------------------------------------

        if (technicianRemarks !== undefined) {
            repair.technicianRemarks = technicianRemarks;
        }


        // --------------------------------------------------------
        // Repair cost
        // --------------------------------------------------------

        if (repairCost !== undefined) {
            repair.repairCost = Number(repairCost);
        }


        // --------------------------------------------------------
        // Estimated completion date
        // --------------------------------------------------------

        if (estimatedCompletionDate !== undefined) {
            repair.estimatedCompletionDate =
                estimatedCompletionDate;
        }


        // --------------------------------------------------------
        // If technician assigned but status not provided
        // --------------------------------------------------------

        if (
            assignedTechnician &&
            !status &&
            repair.status === "Received"
        ) {
            repair.status = "Assigned";
        }


        await repair.save();


        const populatedRepair = await populateRepair(
            newRepair.findById(repair._id)
        );


        return res.status(200).json({
            success: true,
            message: "Repair status updated successfully",
            repair: populatedRepair,
        });

    } catch (error) {
        console.error(
            "UPDATE REPAIR STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update repair status",
            error: error.message,
        });
    }
};







// MARK REPAIR DELIVERED
// PATCH /:id/delivered


export const markDelivered = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair ID",
            });
        }


        const repair = await newRepair.findById(id);


        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair not found",
            });
        }


        // --------------------------------------------------------
        // Check repair status
        // --------------------------------------------------------

        if (
            repair.status !== "Completed" &&
            repair.status !== "Ready for Delivery"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Repair must be completed or ready for delivery before delivery",
            });
        }


        // --------------------------------------------------------
        // Already delivered
        // --------------------------------------------------------

        if (repair.isDelivered) {
            return res.status(400).json({
                success: false,
                message: "Repair has already been delivered",
            });
        }


        repair.isDelivered = true;
        repair.deliveredAt = new Date();

        repair.status = "Completed";


        await repair.save();


        const populatedRepair = await populateRepair(
            newRepair.findById(repair._id)
        );


        return res.status(200).json({
            success: true,
            message: "Repair marked as delivered successfully",
            repair: populatedRepair,
        });

    } catch (error) {
        console.error(
            "MARK DELIVERED ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to mark repair as delivered",
            error: error.message,
        });
    }
};




// ============================================================
//  DELETE REPAIR
// DELETE /:id
// ============================================================

export const deleteRepair = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repair ID",
            });
        }


        const repair = await newRepair.findById(id);


        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "Repair not found",
            });
        }


        await newRepair.findByIdAndDelete(id);



        return res.status(500).json({
            success: false,
            message: "Failed to delete repair",
            error: error.message,
        });
    }
    catch (error) {
        console.log(error.message)
    }
}


//Techniciant List
export const getTechniciansList = async (req, res) => {
    try {
        const technicians = await User.find(
            { role: "TECHNICIAN" },
            "_id name username email specialization"
        );
        console.log(technicians)
        return res.status(200).json({ success: true, technicians });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Get all repairs assigned to the logged-in technician
// @route   GET /api/newRepair/my-assigned-repairs
// @access  Private (Technician)
export const getMyAssignedRepairs = async (req, res) => {
    try {
        const technicianId = req.user.id || req.user._id;

        const repairs = await newRepair.find({
            assignedTechnician: technicianId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: repairs.length,
            repairs,
        });
    } catch (error) {
        console.error("GET ASSIGNED REPAIRS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch assigned repairs",
            error: error.message,
        });
    }
};

// @desc    Update repair status and technician notes/remarks
// @route   PATCH /api/newRepair/:repairId/status
// @access  Private (Technician / Receptionist / Admin)
// export const updateRepairStatus = async (req, res) => {
//     try {
//         const { repairId } = req.params;
//         const { status, remarks } = req.body;

//         const updateFields = {};
//         if (status) updateFields.status = status;
//         if (remarks !== undefined) updateFields.remarks = remarks.trim();

//         const repair = await newRepair.findByIdAndUpdate(repairId, updateFields, {
//             new: true,
//             runValidators: true,
//         });

//         if (!repair) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Repair order not found",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Repair status updated successfully",
//             repair,
//         });
//     } catch (error) {
//         console.error("UPDATE REPAIR STATUS ERROR:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update repair status",
//             error: error.message,
//         });
//     }
// };