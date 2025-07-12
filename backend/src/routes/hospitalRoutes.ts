import express from 'express';
import { getHospitals, getHospitalById, getHospitalSpecialties, getHospitalLocations } from '../controllers/hospitalController';

const router = express.Router();

// Get all hospital specialties (needs to be before /:id route)
router.get('/meta/specialties', getHospitalSpecialties);

// Get all hospital locations (needs to be before /:id route)
router.get('/meta/locations', getHospitalLocations);

// Get all hospitals with pagination, search, and filters
router.get('/', getHospitals);

// Get hospital by ID
router.get('/:id', getHospitalById);

export default router;
