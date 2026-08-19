import express from 'express';
import * as serviceCatlog from './servicecatlog.controller.js';

const router = express.Router();

// GET all service rates
router.get('/get-services', serviceCatlog.getAllServices);

// POST create service rate
router.post('/create-service', serviceCatlog.createService);

// DELETE service rate
router.delete('/delete-service/:id', serviceCatlog.deleteService);

export default router;