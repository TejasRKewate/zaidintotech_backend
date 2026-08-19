import express from 'express';
import {
  getSalesReport,
  getStockReport,
  getUserReport,
} from './report.controller.js';
import authMiddleware from '../../common/middleware/auth.middleware.js';
import roleMiddleware from '../../common/middleware/role.middleware.js';
import ROLES from '../../common/constants/roles.js';

const router = express.Router();

// GET /api/reports/sales?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get(
  '/sales',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getSalesReport
);

// GET /api/reports/stock
router.get(
  '/stock',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getStockReport
);

// GET /api/reports/users?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get(
  '/users',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  getUserReport
);

export default router;