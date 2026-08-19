import express from "express"
const router = express.Router();
import {
    getInvoices,
    getInvoiceById,
    createInvoice,
    deleteInvoice,
} from './walkininovice.controller.js'

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.delete("/:id", deleteInvoice);

export default router