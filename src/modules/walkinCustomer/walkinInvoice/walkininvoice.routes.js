import express from "express"
const router = express.Router();
import {
    getInvoices,
    getInvoiceById,
    createInvoice,
    deleteInvoice,
} from './walkininovice.controller.js'

import { verifyToken } from '../../../common/middleware/auth.middleware.js'
import { allowRoles } from '../../../common/middleware/role.middleware.js'
import { ROLES } from '../../../common/constants/roles.js';


router.get("/", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), getInvoices);
router.get("/:id", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), getInvoiceById);
router.post("/", verifyToken, allowRoles(ROLES.RECEPTIONIST), createInvoice);
router.delete("/:id", verifyToken, allowRoles(ROLES.RECEPTIONIST, ROLES.ADMIN), deleteInvoice);

export default router