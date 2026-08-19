import express from 'express'
import * as repairController from './newrepair.cotroller.js'
import * as repairChargeControl from './repairChargesController.js'
import {
    createRepairValidation, updateRepairValidation, updateRepairStatusValidation
} from './repair.validation.js'
import { validate } from '../../common/middleware/validate.middleware.js'
import { verifyToken } from '../../common/middleware/auth.middleware.js'
//import { getEmployees } from '../users/user.controller.js'

import { protect, restrictTo } from './repairAuth.middleware.js'


const router = express.Router()

router.get("/technicians", verifyToken, restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"), repairController.getTechniciansList)


// CREATE REPAIR
router.post("/create-repair", verifyToken, validate(createRepairValidation), repairController.createRepair)

//Get all repairs
router.get("/all-repairs", verifyToken, restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"), repairController.getAllRepairs)


//VIEW SPECIFIC CUSTOMER & PRODUCT DATA (userId, productId)
// - Both Technician and Receptionist can view
router.get("/user/:userId", verifyToken, restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"),
    repairController.getRepairsByUser
)

router.get(
    "/product/:productId",
    verifyToken,
    restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"),
    repairController.getRepairsByProduct)

// 3. STATUS UPDATE & DELIVERY ACTIONS
// - Status Update: Technician (or Admin)
// - Mark Delivered: Receptionist (or Admin)

router.patch(
    "/:id/status",
    verifyToken,
    restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"),
    validate(updateRepairStatusValidation),
    repairController.updateRepairStatus
);

router.patch(
    "/:id/delivered",
    verifyToken,
    restrictTo("RECEPTIONIST", "ADMIN"),
    repairController.markDelivered
);



// 4. GET BY ID, EDIT DETAILS & DELETE
// - Get: Receptionist, Technician
// - Edit Details: Receptionist, Admin
// - Delete: Admin

router
    .route("/:id")
    .get(
        verifyToken,
        restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"),
        repairController.getRepairById
    )
    .put(
        verifyToken,
        restrictTo("RECEPTIONIST", "ADMIN"),
        validate(updateRepairValidation),
        repairController.updateRepair
    )
    .delete(
        verifyToken,
        restrictTo("ADMIN"),
        repairController.deleteRepair
    );




// Technician charges management

router.get("/track/:ticketNumber", repairChargeControl.trackRepairByTicket);
router.post("/:repairId/charges", verifyToken, restrictTo("TECHNICIAN",), repairChargeControl.addRepairCharge); //trackRepairByTicket
router.put("/:repairId/charges/:chargeId", verifyToken, restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"), repairChargeControl.updateRepairCharge);
router.delete("/:repairId/charges/:chargeId", verifyToken, restrictTo("RECEPTIONIST", "TECHNICIAN", "ADMIN"), repairChargeControl.deleteRepairCharge);
export default router