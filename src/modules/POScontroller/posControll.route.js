import express from "express"
const router = express.Router();
import { verifyToken } from '../../common/middleware/auth.middleware.js'
import { allowRoles } from '../../common/middleware/role.middleware.js'
import { ROLES } from '../../common/constants/roles.js'
const { createWalkInSale, getTodayPOSStats } = require("../controllers/posController");

router.use(verifyToken);

// Dashboard stats: readable by both
router.get("/dashboard-stats", allowRoles("admin", "receptionist"), getTodayPOSStats);

// Front-desk counter checkout: executable only by receptionist
router.post("/walk-in-order/checkout", allowRoles("receptionist"), createWalkInSale);

module.exports = router;