import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All available roles in the dataset
export const getAvailableRoles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const roles = await prisma.jobMarketData.findMany({
      select: { role: true },
      distinct: ['role'],
      orderBy: { role: 'asc' },
    });
    res.json(roles.map(r => r.role));
  } catch (error) {
    console.error('getAvailableRoles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Full analytics for a specific role
export const getRoleAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = decodeURIComponent(req.params.role as string);

    const data = await prisma.jobMarketData.findMany({
      where: { role },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    if (!data.length) {
      res.status(404).json({ error: `No data found for role: ${role}` });
      return;
    }

    // ── Demand trend: monthly postings per year ────────────────────────────
    const years = [...new Set(data.map(d => d.year))].sort();

    // Yearly aggregates for the trend line chart
    const yearlyTrend = years.map(year => {
      const rows = data.filter(d => d.year === year);
      const totalPostings = rows.reduce((s, r) => s + r.jobPostings, 0);
      const avgDemand = rows.reduce((s, r) => s + r.demandIndex, 0) / rows.length;
      const avgSalary = Math.round(rows.reduce((s, r) => s + r.avgSalaryUSD, 0) / rows.length);
      return { year, totalPostings, avgDemand: Math.round(avgDemand * 10) / 10, avgSalary };
    });

    // Monthly breakdown for the current (latest) year
    const latestYear = Math.max(...years);
    const monthlyLatest = data
      .filter(d => d.year === latestYear)
      .map(d => ({
        month: d.month,
        jobPostings: d.jobPostings,
        demandIndex: d.demandIndex,
      }));

    // ── Salary trend ──────────────────────────────────────────────────────
    const salaryTrend = yearlyTrend.map(y => ({ year: y.year, avgSalary: y.avgSalary }));

    // ── Top skills (from latest year data) ────────────────────────────────
    const latestRow = data.find(d => d.year === latestYear);
    const topSkills: string[] = latestRow ? JSON.parse(latestRow.topSkills) : [];
    const topCompanies: string[] = latestRow ? JSON.parse(latestRow.topCompanies) : [];

    // ── Summary stats ─────────────────────────────────────────────────────
    const currentYear  = yearlyTrend[yearlyTrend.length - 1];
    const previousYear = yearlyTrend[yearlyTrend.length - 2];
    const demandChange = previousYear
      ? Math.round(((currentYear.avgDemand - previousYear.avgDemand) / previousYear.avgDemand) * 1000) / 10
      : 0;
    const salaryChange = previousYear
      ? Math.round(((currentYear.avgSalary - previousYear.avgSalary) / previousYear.avgSalary) * 1000) / 10
      : 0;
    const postingsChange = previousYear
      ? Math.round(((currentYear.totalPostings - previousYear.totalPostings) / previousYear.totalPostings) * 1000) / 10
      : 0;

    res.json({
      role,
      summary: {
        currentDemandIndex: currentYear.avgDemand,
        currentAvgSalary:   currentYear.avgSalary,
        currentPostings:    currentYear.totalPostings,
        demandChange,
        salaryChange,
        postingsChange,
        latestYear,
      },
      yearlyTrend,
      monthlyLatest,
      salaryTrend,
      topSkills,
      topCompanies,
    });
  } catch (error) {
    console.error('getRoleAnalytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Compare multiple roles side by side
export const compareRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = (req.query.roles as string || '').split(',').map(r => r.trim()).filter(Boolean);

    if (!roles.length) {
      res.status(400).json({ error: 'Provide roles as ?roles=React Developer,Data Scientist' });
      return;
    }

    const results = await Promise.all(roles.map(async role => {
      const data = await prisma.jobMarketData.findMany({
        where: { role },
        orderBy: [{ year: 'asc' }, { month: 'asc' }],
      });
      if (!data.length) return null;

      const years = [...new Set(data.map(d => d.year))].sort();
      const yearlyTrend = years.map(year => {
        const rows = data.filter(d => d.year === year);
        return {
          year,
          totalPostings: rows.reduce((s, r) => s + r.jobPostings, 0),
          avgDemand: Math.round(rows.reduce((s, r) => s + r.demandIndex, 0) / rows.length * 10) / 10,
          avgSalary: Math.round(rows.reduce((s, r) => s + r.avgSalaryUSD, 0) / rows.length),
        };
      });

      return { role, yearlyTrend };
    }));

    res.json(results.filter(Boolean));
  } catch (error) {
    console.error('compareRoles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
