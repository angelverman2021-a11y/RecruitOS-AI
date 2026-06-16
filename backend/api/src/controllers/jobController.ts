import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Create job request:', { body: req.body, user: (req as any).user });
    
    const { title, description, department, location, status } = req.body;
    const recruiterId = (req as any).user?.id;

    if (!recruiterId) {
      console.error('❌ No recruiterId found in request');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!title || !description || !department || !location) {
      console.error('❌ Missing required fields:', { title, description, department, location });
      res.status(400).json({ error: 'title, description, department and location are required' });
      return;
    }

    console.log('💾 Creating job in database...');
    const job = await prisma.job.create({
      data: { title, description, department, location, status: status || 'OPEN', recruiterId },
    });

    console.log('✅ Job created successfully:', job.id);
    res.status(201).json(job);
  } catch (error) {
    console.error('❌ Create job error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
};

export const getJobs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recruiter: { select: { name: true, email: true } },
        _count: { select: { candidates: true } },
      },
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.job.delete({ where: { id } });
    res.status(200).json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
