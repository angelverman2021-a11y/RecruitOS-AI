import { Router } from 'express';
import { getAvailableRoles, getRoleAnalytics, compareRoles } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/roles',           authenticate, getAvailableRoles);
router.get('/roles/:role',     authenticate, getRoleAnalytics);
router.get('/compare',         authenticate, compareRoles);

export default router;
