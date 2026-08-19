const Coupon = require("./coupon.model");

// Create Coupon
const createCoupon = async (data) => {
  return await Coupon.create(data);
};

// Get All Coupons
const getAllCoupons = async () => {
  return await Coupon.find().sort({ createdAt: -1 });
};

// Get Coupon By Id
const getCouponById = async (id) => {
  return await Coupon.findById(id);
};

// Get Coupon By Code
const getCouponByCode = async (code) => {
  return await Coupon.findOne({
    code: code.toUpperCase(),
  });
};

// Update Coupon
const updateCoupon = async (id, data) => {
  return await Coupon.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Delete Coupon
const deleteCoupon = async (id) => {
  return await Coupon.findByIdAndDelete(id);
};

// Increment Coupon Usage
const incrementUsedCount = async (id) => {
  return await Coupon.findByIdAndUpdate(
    id,
    {
      $inc: {
        usedCount: 1,
      },
    },
    {
      new: true,
    }
  );
};

// Activate / Deactivate Coupon
const updateCouponStatus = async (id, isActive) => {
  return await Coupon.findByIdAndUpdate(
    id,
    {
      isActive,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  incrementUsedCount,
  updateCouponStatus,
};