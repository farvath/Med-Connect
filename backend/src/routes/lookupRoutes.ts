import { Router } from 'express';
import { getInstitutionsList, getSpecialitiesList, getCitiesList } from '../controllers/lookupController';

const router = Router();

router.get('/institutions-list', getInstitutionsList);
router.get('/specialities-list', getSpecialitiesList);
router.get('/cities-list', getCitiesList);

export default router;
