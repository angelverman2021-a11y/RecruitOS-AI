import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { scoreCandidate, extractResumeDetails, generateCandidateEmail, generateCoverLetter } from '../services/aiService';

const prisma = new PrismaClient();

export const evaluateCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateId, jobId } = req.body;

    if (!candidateId || !jobId) {
      res.status(400).json({ error: 'candidateId and jobId are required' });
      return;
    }

    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!candidate || !job) {
      res.status(404).json({ error: 'Candidate or Job not found' });
      return;
    }

    const score = await scoreCandidate(candidate.skills, job.description);

    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: { matchScore: score },
      include: { job: { select: { title: true, id: true } } },
    });

    res.status(200).json({ message: 'Candidate scored successfully', score, candidate: updatedCandidate });
  } catch (error) {
    console.error('AI Evaluation error:', error);
    res.status(500).json({ error: 'Internal server error during AI evaluation' });
  }
};

export const parseResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      res.status(400).json({ error: 'resumeText is required' });
      return;
    }

    const parsed = await extractResumeDetails(resumeText);
    res.status(200).json({
      skills: parsed.skills || '',
      experience: parsed.experience || '',
      location: parsed.location || '',
    });
  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ error: 'Internal server error during resume parsing' });
  }
};

export const generateEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      res.status(400).json({ error: 'candidateId is required' });
      return;
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { job: true },
    });

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }

    if (candidate.matchScore === 0) {
      res.status(400).json({ error: 'Run AI scoring first before generating an email.' });
      return;
    }

    const email = await generateCandidateEmail(
      candidate.name,
      candidate.skills,
      candidate.matchScore,
      candidate.job.title,
      candidate.job.description
    );

    res.status(200).json({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      matchScore: candidate.matchScore,
      emailType: candidate.matchScore >= 85 ? 'INTERVIEW_INVITATION' : 'REJECTION',
      ...email,
    });
  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({ error: 'Internal server error during email generation' });
  }
};

export const generateCoverLetterHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateId, companyName } = req.body;

    if (!candidateId) {
      res.status(400).json({ error: 'candidateId is required' });
      return;
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { job: true },
    });

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }

    const result = await generateCoverLetter(
      candidate.name,
      candidate.skills,
      candidate.experience || '',
      candidate.job.title,
      candidate.job.description,
      companyName || 'Your Company'
    );

    res.status(200).json({
      candidateId: candidate.id,
      candidateName: candidate.name,
      jobTitle: candidate.job.title,
      companyName: companyName || 'Your Company',
      ...result,
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: 'Internal server error during cover letter generation' });
  }
};
