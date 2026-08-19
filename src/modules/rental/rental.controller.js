const rentalService = require("./rental.service");

// Create Rental
const createRental = async (req, res, next) => {
  try {
    const rental = await rentalService.createRental(req.body);

    return res.status(201).json({
      success: true,
      message: "Rental booked successfully.",
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Rentals
const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.getAllRentals();

    return res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    next(error);
  }
};

// Get Rental By Id
const getRentalById = async (req, res, next) => {
  try {
    const rental = await rentalService.getRentalById(req.params.id);

    return res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

// Get Rentals By User
const getRentalsByUser = async (req, res, next) => {
  try {
    const rentals = await rentalService.getRentalsByUser(req.params.userId);

    return res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    next(error);
  }
};

// Update Rental
const updateRental = async (req, res, next) => {
  try {
    const rental = await rentalService.updateRental(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Rental updated successfully.",
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

// Update Rental Status
const updateRentalStatus = async (req, res, next) => {
  try {
    const rental = await rentalService.updateRentalStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      message: "Rental status updated successfully.",
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

// Return Rental
const returnRental = async (req, res, next) => {
  try {
    const rental = await rentalService.returnRental(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Rental returned successfully.",
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Rental
const deleteRental = async (req, res, next) => {
  try {
    await rentalService.deleteRental(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Rental deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRental,
  getAllRentals,
  getRentalById,
  getRentalsByUser,
  updateRental,
  updateRentalStatus,
  returnRental,
  deleteRental,
};