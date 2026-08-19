const Joi = require("joi");

// Create Coupon Validation
const createCouponValidation = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .required()
    .messages({
      "string.empty": "Coupon code is required.",
      "any.required": "Coupon code is required.",
    }),

  description: Joi.string()
    .trim()
    .allow("")
    .max(255),

  discountType: Joi.string()
    .valid("percent", "flat")
    .required()
    .messages({
      "any.only": "Discount type must be either percent or flat.",
      "any.required": "Discount type is required.",
    }),

  value: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Discount value must be a number.",
      "number.positive": "Discount value must be greater than 0.",
      "any.required": "Discount value is required.",
    }),

  minOrderValue: Joi.number()
    .min(0)
    .default(0),

  maxDiscount: Joi.number()
    .min(0)
    .default(0),

  usageLimit: Joi.number()
    .integer()
    .min(1)
    .default(1),

  expiryDate: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Expiry date must be in the future.",
      "any.required": "Expiry date is required.",
    }),

  isActive: Joi.boolean().default(true),
});

// Update Coupon Validation
const updateCouponValidation = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase(),

  description: Joi.string()
    .trim()
    .allow("")
    .max(255),

  discountType: Joi.string()
    .valid("percent", "flat"),

  value: Joi.number()
    .positive(),

  minOrderValue: Joi.number()
    .min(0),

  maxDiscount: Joi.number()
    .min(0),

  usageLimit: Joi.number()
    .integer()
    .min(1),

  expiryDate: Joi.date(),

  isActive: Joi.boolean(),
});

// Apply Coupon Validation
const applyCouponValidation = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .required()
    .messages({
      "any.required": "Coupon code is required.",
    }),

  orderAmount: Joi.number()
    .positive()
    .required()
    .messages({
      "number.positive": "Order amount must be greater than 0.",
      "any.required": "Order amount is required.",
    }),
});

// Update Coupon Status Validation
const updateCouponStatusValidation = Joi.object({
  isActive: Joi.boolean()
    .required()
    .messages({
      "any.required": "Coupon status is required.",
    }),
});

module.exports = {
  createCouponValidation,
  updateCouponValidation,
  applyCouponValidation,
  updateCouponStatusValidation,
};