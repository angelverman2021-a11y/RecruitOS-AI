import { Router } from 'express';
import { createJob, getJobs, deleteJob } from '../controllers/jobController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getJobs);
router.post('/', authenticate, createJob);
router.delete('/:id', authenticate, deleteJob);

export default router;
