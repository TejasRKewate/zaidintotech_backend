import express from 'express'
const router = express.Router();
import { validate } from '../../common/middleware/validate.middleware.js';
import { createRepairValidation, updateRepairStatusValidation, updateRepairValidation } from './repair.validation.js'

import * as repairController from "./repair.controller.js";

// Create Repair Request
router.post("/request", validate(createRepairValidation), repairController.createRepair);

// Get All Repair Requests
router.get("/", repairController.getAllRepairs);

// Get Repair By Id
router.get("/:id", repairController.getRepairById);

// Get Repairs By User
router.get("/user/:userId", repairController.getRepairsByUser);

// Get Repairs By Product
router.get("/product/:productId", repairController.getRepairsByProduct);

// Update Repair
router.put("/:id", validate(updateRepairValidation), repairController.updateRepair);

// Update Repair Status
router.patch("/:id/status", validate(updateRepairStatusValidation), repairController.updateRepairStatus);

// Mark Repair Delivered
router.patch("/:id/delivered", repairController.markDelivered);

// Delete Repair
router.delete("/:id", repairController.deleteRepair);

export default router;