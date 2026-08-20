import express from 'express'
const router = express.Router()
import {
    getCustomers,
    getCustomerById,
    createCustomer,
    deleteCustomer,
} from './walkin.controller.js'

import { verifyToken } from '../../common/middleware/auth.middleware.js'
import { allowRoles } from '../../common/middleware/role.middleware.js'
import { ROLES } from '../../common/constants/roles.js'


router.get("/getall-customer", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), getCustomers);
router.get("/walkin-customer/:id", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), getCustomerById);
router.post("/create-customer", verifyToken, allowRoles(ROLES.RECEPTIONIST), createCustomer);
router.delete("/:id", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), deleteCustomer);


export default router;