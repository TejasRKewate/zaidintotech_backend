import express from 'express'
const router = express.Router();

const rentalController = require("./rental.controller");

// Create Rental
router.post("/book", rentalController.createRental);

// Get All Rentals
router.get("/", rentalController.getAllRentals);

// Get Rental By Id
router.get("/:id", rentalController.getRentalById);

// Get Rentals By User
router.get("/user/:userId", rentalController.getRentalsByUser);

// Update Rental
router.put("/:id", rentalController.updateRental);

// Update Rental Status
router.patch("/:id/status", rentalController.updateRentalStatus);

// Return Rental
router.patch("/:id/return", rentalController.returnRental);

// Delete Rental
router.delete("/:id", rentalController.deleteRental);

export default router;