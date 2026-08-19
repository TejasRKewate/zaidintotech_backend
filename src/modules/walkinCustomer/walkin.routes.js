import express from 'express'
const router = express.Router()
import {
    getCustomers,
    getCustomerById,
    createCustomer,
    deleteCustomer,
} from './walkin.controller.js'

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.delete("/:id", deleteCustomer);


export default router;