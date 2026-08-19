import express from 'express'
const router = express.Router();
import {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder,
} from './walikinorder.controller.js'
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);
export default router