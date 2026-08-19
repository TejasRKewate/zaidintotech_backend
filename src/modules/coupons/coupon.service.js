const couponRepository = require("./coupon.repository");

// Create Coupon
const createCoupon = async (couponData) => {
  const existingCoupon = await couponRepository.getCouponByCode(
    couponData.code
  );

  if (existingCoupon) {
    throw new Error("Coupon code already exists.");
  }

  return await couponRepository.createCoupon(couponData);
};

// Get All Coupons
const getAllCoupons = async () => {
  return await couponRepository.getAllCoupons();
};

// Get Coupon By Id
const getCouponById = async (id) => {
  const coupon = await couponRepository.getCouponById(id);

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  return coupon;
};

// Get Coupon By Code
const getCouponByCode = async (code) => {
  const coupon = await couponRepository.getCouponByCode(code);

  if (!coupon) {
    throw new Error("Invalid coupon code.");
  }

  return coupon;
};

// Update Coupon
const updateCoupon = async (id, data) => {
  const coupon = await couponRepository.updateCoupon(id, data);

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  return coupon;
};

// Delete Coupon
const deleteCoupon = async (id) => {
  const coupon = await couponRepository.deleteCoupon(id);

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  return coupon;
};

// Activate / Deactivate Coupon
const updateCouponStatus = async (id, isActive) => {
  const coupon = await couponRepository.updateCouponStatus(id, isActive);

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  return coupon;
};

// Apply Coupon
const applyCoupon = async (code, orderAmount) => {
  const coupon = await couponRepository.getCouponByCode(code);

  if (!coupon) {
    throw new Error("Invalid coupon code.");
  }

  if (!coupon.isActive) {
    throw new Error("Coupon is inactive.");
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    throw new Error("Coupon has expired.");
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit exceeded.");
  }

  if (orderAmount < coupon.minOrderValue) {
    throw new Error(
      `Minimum order amount should be ₹${coupon.minOrderValue}.`
    );
  }

  let discount = 0;

  if (coupon.discountType === "percent") {
    discount = (orderAmount * coupon.value) / 100;

    if (
      coupon.maxDiscount > 0 &&
      discount > coupon.maxDiscount
    ) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }

  const finalAmount = orderAmount - discount;

  return {
    coupon,
    discount,
    finalAmount,
  };
};

// Increase Coupon Usage Count
const incrementCouponUsage = async (id) => {
  return await couponRepository.incrementUsedCount(id);
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  applyCoupon,
  incrementCouponUsage,
};