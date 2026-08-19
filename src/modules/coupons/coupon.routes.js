import express from 'express'
const router = express.Router();

const couponController = require("./coupon.controller");

// Create Coupon
router.post("/", couponController.createCoupon);

// Get All Coupons
router.get("/", couponController.getAllCoupons);

// Apply Coupon
router.post("/apply", couponController.applyCoupon);

// Get Coupon By Code
router.get("/code/:code", couponController.getCouponByCode);

// Get Coupon By Id
router.get("/:id", couponController.getCouponById);

// Update Coupon
router.put("/:id", couponController.updateCoupon);

// Activate / Deactivate Coupon
router.patch("/:id/status", couponController.updateCouponStatus);

// Delete Coupon
router.delete("/:id", couponController.deleteCoupon);

export default router