const Joi = require("joi");

// Create Rental Validation
const createRentalValidation = Joi.object({
  product: Joi.string()
    .required()
    .messages({
      "string.empty": "Product is required.",
      "any.required": "Product is required.",
    }),

  user: Joi.string()
    .required()
    .messages({
      "string.empty": "User is required.",
      "any.required": "User is required.",
    }),

  startDate: Joi.date()
    .required()
    .messages({
      "date.base": "Start date must be a valid date.",
      "any.required": "Start date is required.",
    }),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required()
    .messages({
      "date.greater": "End date must be greater than start date.",
      "any.required": "End date is required.",
    }),

  rentAmount: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Rent amount must be a number.",
      "number.min": "Rent amount cannot be negative.",
      "any.required": "Rent amount is required.",
    }),

  totalDays: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Total days must be a number.",
      "number.min": "Minimum rental period is 1 day.",
      "any.required": "Total days is required.",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .default(1),

  securityDeposit: Joi.number()
    .min(0)
    .default(0),

  remarks: Joi.string()
    .allow("")
    .max(500),

  rentalStatus: Joi.string()
    .valid("Booked", "Active", "Returned", "Cancelled", "Late")
    .optional(),

  paymentStatus: Joi.string()
    .valid("Pending", "Paid", "Refunded")
    .optional(),
});

// Update Rental Validation
const updateRentalValidation = Joi.object({
  startDate: Joi.date(),

  endDate: Joi.date()
    .greater(Joi.ref("startDate")),

  rentAmount: Joi.number().min(0),

  totalDays: Joi.number().integer().min(1),

  quantity: Joi.number().integer().min(1),

  securityDeposit: Joi.number().min(0),

  remarks: Joi.string()
    .allow("")
    .max(500),

  rentalStatus: Joi.string().valid(
    "Booked",
    "Active",
    "Returned",
    "Cancelled",
    "Late"
  ),

  paymentStatus: Joi.string().valid(
    "Pending",
    "Paid",
    "Refunded"
  ),
});

// Update Status Validation
const updateRentalStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
      "Booked",
      "Active",
      "Returned",
      "Cancelled",
      "Late"
    )
    .required()
    .messages({
      "any.required": "Status is required.",
    }),
});

module.exports = {
  createRentalValidation,
  updateRentalValidation,
  updateRentalStatusValidation,
};