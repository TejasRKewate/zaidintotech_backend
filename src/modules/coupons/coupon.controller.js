const couponService = require("./coupon.service");

const {
  createCouponValidation,
  updateCouponValidation,
  applyCouponValidation,
} = require("./coupon.validation");

// Create Coupon
const createCoupon = async (req, res, next) => {
  try {
    const { error, value } = createCouponValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const coupon = await couponService.createCoupon(value);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Coupons
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

// Get Coupon By Id
const getCouponById = async (req, res, next) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Get Coupon By Code
const getCouponByCode = async (req, res, next) => {
  try {
    const coupon = await couponService.getCouponByCode(req.params.code);

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Update Coupon
const updateCoupon = async (req, res, next) => {
  try {
    const { error, value } = updateCouponValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const coupon = await couponService.updateCoupon(
      req.params.id,
      value
    );

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Apply Coupon
const applyCoupon = async (req, res, next) => {
  try {
    const { error, value } = applyCouponValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await couponService.applyCoupon(
      value.code,
      value.orderAmount
    );

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Activate / Deactivate Coupon
const updateCouponStatus = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCouponStatus(
      req.params.id,
      req.body.isActive
    );

    return res.status(200).json({
      success: true,
      message: "Coupon status updated successfully.",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Coupon
const deleteCoupon = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  applyCoupon,
  updateCouponStatus,
  deleteCoupon,
};