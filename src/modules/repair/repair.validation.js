import Joi from "joi";

// Create Repair Validation
// export const createRepairValidation = Joi.object({
//   user: Joi.string()
//     .required()
//     .messages({
//       "string.empty": "User is required.",
//       "any.required": "User is required.",
//     }),

//   product: Joi.string()
//     .required()
//     .messages({
//       "string.empty": "Product is required.",
//       "any.required": "Product is required.",
//     }),

//   issueDescription: Joi.string()
//     .trim()
//     .min(5)
//     .max(500)
//     .required()
//     .messages({
//       "string.empty": "Issue description is required.",
//       "string.min": "Issue description must be at least 5 characters.",
//       "string.max": "Issue description cannot exceed 500 characters.",
//       "any.required": "Issue description is required.",
//     }),

//   estimatedCompletionDate: Joi.date().optional(),

//   repairCost: Joi.number()
//     .min(0)
//     .default(0)
//     .messages({
//       "number.base": "Repair cost must be a number.",
//       "number.min": "Repair cost cannot be negative.",
//     }),

//   technicianName: Joi.string()
//     .trim()
//     .allow("")
//     .max(100),

//   remarks: Joi.string()
//     .trim()
//     .allow("")
//     .max(500),

//   status: Joi.string()
//     .valid(
//       "Received",
//       "In Progress",
//       "Completed",
//       "Cancelled"
//     )
//     .optional(),
// });

export const createRepairValidation = Joi.object({
  user: Joi.string().required().messages({
    "string.empty": "User is required.",
    "any.required": "User is required.",
  }),

  product: Joi.string().required().messages({
    "string.empty": "Product is required.",
    "any.required": "Product is required.",
  }),

  issueDescription: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Issue description is required.",
    "string.min": "Issue description must be at least 5 characters.",
    "string.max": "Issue description cannot exceed 500 characters.",
    "any.required": "Issue description is required.",
  }),

  // --- Added Fields ---
  deviceModel: Joi.string().trim().optional().allow(""),
  serialNumber: Joi.string().trim().optional().allow(""),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent").default("Medium"),
  estimatedCost: Joi.number().min(0).optional(),
  // --------------------

  estimatedCompletionDate: Joi.date().optional(),
  repairCost: Joi.number().min(0).default(0),
  technicianName: Joi.string().trim().allow("").max(100),
  remarks: Joi.string().trim().allow("").max(500),
  status: Joi.string().valid("Received", "In Progress", "Completed", "Cancelled").optional(),
});

// Update Repair Validation
// export const updateRepairValidation = Joi.object({
//   issueDescription: Joi.string()
//     .trim()
//     .min(5)
//     .max(500),

//   estimatedCompletionDate: Joi.date(),

//   repairCost: Joi.number().min(0),

//   technicianName: Joi.string()
//     .trim()
//     .allow("")
//     .max(100),

//   remarks: Joi.string()
//     .trim()
//     .allow("")
//     .max(500),

//   status: Joi.string().valid(
//     "Received",
//     "In Progress",
//     "Completed",
//     "Cancelled"
//   ),

//   isDelivered: Joi.boolean(),
// });


export const updateRepairValidation = Joi.object({
  user: Joi.string().hex().length(24).optional(),
  product: Joi.string().hex().length(24).optional(),
  issueDescription: Joi.string().optional(),

  // Add the missing fields here:
  deviceModel: Joi.string().allow('', null).optional(),
  serialNumber: Joi.string().allow('', null).optional(),
  technicianNotes: Joi.string().allow('', null).optional(),
  finalCost: Joi.number().min(0).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent').optional(),
  status: Joi.string().optional()
});

// Update Status Validation
export const updateRepairStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
      "Received",
      "In Progress",
      "Completed",
      "Cancelled"
    )
    .required()
    .messages({
      "any.required": "Status is required.",
    }),
});

// export {
//   createRepairValidation,
//   updateRepairValidation,
//   updateRepairStatusValidation,
// };