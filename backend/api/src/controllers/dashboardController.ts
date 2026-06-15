import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalJobs, openJobs, totalCandidates, hiredCandidates, recentJobs, topCandidates] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.candidate.count(),
      prisma.candidate.count({ where: { status: 'HIRED' } }),
      prisma.job.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          department: true,
          location: true,
          status: true,
          createdAt: true,
          _count: { select: { candidates: true } }
        }
      }),
      prisma.candidate.findMany({
        take: 5,
        orderBy: { matchScore: 'desc' },
        where: { matchScore: { gt: 0 } },
        select: {
          id: true,
          name: true,
          matchScore: true,
          status: true,
          job: { select: { title: true } }
        }
      }),
    ]);

    res.status(200).json({
      totalJobs,
      openJobs,
      totalCandidates,
      hiredCandidates,
      recentJobs,
      topCandidates,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
