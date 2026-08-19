import express from 'express';
import * as shipmentController from './shipment.controller.js';
import authMiddleware from '../../common/middleware/auth.middleware.js';
import roleMiddleware from '../../common/middleware/role.middleware.js';
import ROLES from '../../common/constants/roles.js';

const router = express.Router();

// PATCH /api/shipment/:orderId/update
router.patch(
  '/:orderId/update',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  shipmentController.updateShipment
);

// GET /api/shipment/:orderId
router.get(
  '/:orderId',
  authMiddleware,
  shipmentController.getShipmentDetails
);

export default router;