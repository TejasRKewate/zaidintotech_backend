const rentalRepository = require("./rental.repository");

// Create Rental Booking
const createRental = async (rentalData) => {
  const {
    product,
    user,
    startDate,
    endDate,
    rentAmount,
    totalDays,
  } = rentalData;

  // Check availability
  const existingRental = await rentalRepository.checkAvailability(
    product,
    startDate,
    endDate
  );

  if (existingRental.length > 0) {
    throw new Error("Product is not available for the selected dates.");
  }

  const rental = await rentalRepository.createRental({
    product,
    user,
    startDate,
    endDate,
    rentAmount,
    totalDays,
    quantity: rentalData.quantity || 1,
    securityDeposit: rentalData.securityDeposit || 0,
    remarks: rentalData.remarks || "",
  });

  return rental;
};

// Get Rental By Id
const getRentalById = async (id) => {
  const rental = await rentalRepository.getRentalById(id);

  if (!rental) {
    throw new Error("Rental not found.");
  }

  return rental;
};

// Get All Rentals
const getAllRentals = async () => {
  return await rentalRepository.getAllRentals();
};

// Get Rentals By User
const getRentalsByUser = async (userId) => {
  return await rentalRepository.getRentalsByUser(userId);
};

// Update Rental
const updateRental = async (id, data) => {
  const rental = await rentalRepository.updateRental(id, data);

  if (!rental) {
    throw new Error("Rental not found.");
  }

  return rental;
};

// Update Rental Status
const updateRentalStatus = async (id, status) => {
  const rental = await rentalRepository.updateRentalStatus(id, status);

  if (!rental) {
    throw new Error("Rental not found.");
  }

  return rental;
};

// Return Rental
const returnRental = async (id) => {
  const rental = await rentalRepository.markReturned(id);

  if (!rental) {
    throw new Error("Rental not found.");
  }

  return rental;
};

// Delete Rental
const deleteRental = async (id) => {
  const rental = await rentalRepository.deleteRental(id);

  if (!rental) {
    throw new Error("Rental not found.");
  }

  return rental;
};

module.exports = {
  createRental,
  getRentalById,
  getAllRentals,
  getRentalsByUser,
  updateRental,
  updateRentalStatus,
  returnRental,
  deleteRental,
};