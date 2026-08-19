const Rental = require("./rental.model");

// Create Rental
const createRental = async (data) => {
  return await Rental.create(data);
};

// Get Rental By Id
const getRentalById = async (id) => {
  return await Rental.findById(id)
    .populate("user")
    .populate("product");
};

// Get All Rentals
const getAllRentals = async () => {
  return await Rental.find()
    .populate("user")
    .populate("product")
    .sort({ createdAt: -1 });
};

// Get Rentals By User
const getRentalsByUser = async (userId) => {
  return await Rental.find({ user: userId })
    .populate("product")
    .sort({ createdAt: -1 });
};

// Get Rentals By Product
const getRentalsByProduct = async (productId) => {
  return await Rental.find({ product: productId });
};

// Check Product Availability
const checkAvailability = async (productId, startDate, endDate) => {
  return await Rental.find({
    product: productId,
    rentalStatus: {
      $in: ["Booked", "Active"],
    },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });
};

// Update Rental
const updateRental = async (id, data) => {
  return await Rental.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Update Rental Status
const updateRentalStatus = async (id, status) => {
  return await Rental.findByIdAndUpdate(
    id,
    { rentalStatus: status },
    { new: true }
  );
};

// Mark Rental Returned
const markReturned = async (id) => {
  return await Rental.findByIdAndUpdate(
    id,
    {
      rentalStatus: "Returned",
      isReturned: true,
      returnedAt: new Date(),
    },
    { new: true }
  );
};

// Delete Rental
const deleteRental = async (id) => {
  return await Rental.findByIdAndDelete(id);
};

module.exports = {
  createRental,
  getRentalById,
  getAllRentals,
  getRentalsByUser,
  getRentalsByProduct,
  checkAvailability,
  updateRental,
  updateRentalStatus,
  markReturned,
  deleteRental,
};