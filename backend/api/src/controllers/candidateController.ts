import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, skills, jobId, experience, location } = req.body;

    if (!name || !email || !skills || !jobId) {
      res.status(400).json({ error: 'name, email, skills and jobId are required' });
      return;
    }

    // Check if email already exists for this job
    const existing = await prisma.candidate.findFirst({ where: { email, jobId } });
    if (existing) {
      res.status(400).json({ error: 'A candidate with this email already exists for this job' });
      return;
    }

    const candidate = await prisma.candidate.create({
      data: { name, email, skills, experience: experience || null, location: location || null, jobId, status: 'APPLIED' },
      include: { job: { select: { title: true } } },
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCandidates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { title: true, id: true } } },
    });
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCandidateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: { status },
      include: { job: { select: { title: true, id: true } } },
    });

    res.status(200).json(candidate);
  } catch (error) {
    console.error('Update candidate status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.candidate.delete({ where: { id } });
    res.status(200).json({ message: 'Candidate deleted' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
