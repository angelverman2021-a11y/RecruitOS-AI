import { Router } from 'express';
import { evaluateCandidate, parseResume, generateEmail, generateCoverLetterHandler } from '../controllers/aiController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/score', authenticate, evaluateCandidate);
router.post('/parse-resume', authenticate, parseResume);
router.post('/generate-email', authenticate, generateEmail);
router.post('/cover-letter', authenticate, generateCoverLetterHandler);

export default router;
