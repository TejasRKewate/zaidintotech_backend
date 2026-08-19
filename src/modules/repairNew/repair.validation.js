import Joi from "joi";


// CREATE REPAIR

// export const createRepairValidation = Joi.object({
//     customerName: Joi.string()
//         .trim()
//         .min(2)
//         .max(100)
//         .required(),

//     customerPhone: Joi.string()
//         .trim()
//         .pattern(/^[0-9]{10}$/)
//         .required(),

//     laptopModel: Joi.string()
//         .trim()
//         .min(2)
//         .max(150)
//         .required(),

//     issueDescription: Joi.string()
//         .trim()
//         .min(3)
//         .max(1000)
//         .required(),

//     remarks: Joi.string()
//         .trim()
//         .max(1000)
//         .allow("")
//         .optional(),

//     user: Joi.string()
//         .allow(null, "")
//         .optional(),

//     product: Joi.string()
//         .allow(null, "")
//         .optional(),
// });

export const createRepairValidation = Joi.object({
    customerName: Joi.string().trim().required(),
    customerPhone: Joi.string().trim().required(),
    laptopModel: Joi.string().trim().required(),
    issueDescription: Joi.string().trim().required(),
    remarks: Joi.string().allow("").optional(),

    // Add these missing fields:
    technicianName: Joi.string().allow("").optional(),
    status: Joi.string()
        .valid(
            "Received",
            "Assigned",
            "In Progress",
            "Waiting for Parts",
            "Ready for Delivery",
            "Completed",
            "Cancelled"
        )
        .default("Received"),
    assignedTechnician: Joi.string().hex().length(24).allow(null, "").optional(),
    user: Joi.string().allow("").optional(),
    product: Joi.string().allow("").optional(),
});


// UPDATE REPAIR

export const updateRepairValidation = Joi.object({
    customerName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    customerPhone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .optional(),

    laptopModel: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .optional(),

    issueDescription: Joi.string()
        .trim()
        .max(1000)
        .optional(),

    estimatedCost: Joi.number()
        .min(0)
        .optional(),

    repairCost: Joi.number()
        .min(0)
        .optional(),

    estimatedCompletionDate: Joi.date()
        .optional(),

    remarks: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .optional(),

    technicianRemarks: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .optional(),
});


// STATUS


export const updateRepairStatusValidation = Joi.object({
    status: Joi.string()
        .valid(
            "Received",
            "Assigned",
            "In Progress",
            "Waiting for Parts",
            "Ready for Delivery",
            "Completed",
            "Cancelled"
        )
        .required(),

    assignedTechnician: Joi.string()
        .allow(null, "")
        .optional(),

    technicianRemarks: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .optional(),

    repairCost: Joi.number()
        .min(0)
        .optional(),

    estimatedCompletionDate: Joi.date()
        .allow(null)
        .optional(),
});