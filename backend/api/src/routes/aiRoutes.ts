import { Router } from 'express';
import { evaluateCandidate, parseResume, generateEmail } from '../controllers/aiController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Protect the AI routes using the JWT authentication middleware
router.post('/score', authenticate, evaluateCandidate);
router.post('/parse-resume', authenticate, parseResume);
router.post('/generate-email', authenticate, generateEmail);

export default router;
