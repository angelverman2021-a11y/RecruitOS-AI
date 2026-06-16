import { Router } from 'express';
import { createCandidate, getCandidates, updateCandidateStatus, deleteCandidate, getCandidateHistory } from '../controllers/candidateController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getCandidates);
router.post('/', authenticate, createCandidate);
router.patch('/:id/status', authenticate, updateCandidateStatus);
router.delete('/:id', authenticate, deleteCandidate);
router.get('/:id/history', authenticate, getCandidateHistory);

export default router;
