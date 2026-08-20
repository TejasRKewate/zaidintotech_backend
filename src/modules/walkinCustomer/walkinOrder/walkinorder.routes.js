import express from 'express'
const router = express.Router();
import {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder,
} from './walikinorder.controller.js'

import { verifyToken } from '../../../common/middleware/auth.middleware.js'
import { allowRoles } from '../../../common/middleware/role.middleware.js'
import { ROLES } from '../../../common/constants/roles.js';


router.get("/", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), getOrders);
router.get("/:id", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), getOrderById);
router.post("/", verifyToken, allowRoles(ROLES.RECEPTIONIST), createOrder);
router.delete("/:id", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), deleteOrder);
export default router