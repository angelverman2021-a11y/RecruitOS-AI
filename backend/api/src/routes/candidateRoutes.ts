import { Router } from 'express';
import { createCandidate, getCandidates, updateCandidateStatus, deleteCandidate } from '../controllers/candidateController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getCandidates);
router.post('/', authenticate, createCandidate);
router.patch('/:id/status', authenticate, updateCandidateStatus);
router.delete('/:id', authenticate, deleteCandidate);

export default router;
