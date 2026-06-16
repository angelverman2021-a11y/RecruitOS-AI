import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── Market data per role ─────────────────────────────────────────────────────
const ROLES: Record<string, {
  baseSalary: number;
  salaryGrowth: number;
  basePostings: number;
  demandBase: number;
  demandGrowth: number;
  topCompanies: string[];
  topSkills: string[];
  covidDip: boolean;
}> = {
  'React Developer': {
    baseSalary: 95000, salaryGrowth: 4500,
    basePostings: 4200, demandBase: 58, demandGrowth: 5.2, covidDip: false,
    topCompanies: ['Meta', 'Airbnb', 'Netflix', 'Shopify', 'Stripe', 'Vercel'],
    topSkills: ['React', 'TypeScript', 'Redux', 'Next.js', 'GraphQL', 'CSS'],
  },
  'Data Scientist': {
    baseSalary: 105000, salaryGrowth: 5200,
    basePostings: 3800, demandBase: 62, demandGrowth: 7.1, covidDip: true,
    topCompanies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'OpenAI', 'Palantir'],
    topSkills: ['Python', 'TensorFlow', 'SQL', 'PyTorch', 'Spark', 'R'],
  },
  'DevOps Engineer': {
    baseSalary: 110000, salaryGrowth: 5000,
    basePostings: 3100, demandBase: 55, demandGrowth: 8.3, covidDip: false,
    topCompanies: ['AWS', 'Google Cloud', 'HashiCorp', 'Cloudflare', 'Datadog', 'Atlassian'],
    topSkills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Linux'],
  },
  'Product Manager': {
    baseSalary: 115000, salaryGrowth: 4800,
    basePostings: 5500, demandBase: 65, demandGrowth: 4.5, covidDip: true,
    topCompanies: ['Google', 'Meta', 'Uber', 'Salesforce', 'LinkedIn', 'Spotify'],
    topSkills: ['Roadmapping', 'Agile', 'SQL', 'A/B Testing', 'Figma', 'JIRA'],
  },
  'Machine Learning Engineer': {
    baseSalary: 125000, salaryGrowth: 7000,
    basePostings: 2200, demandBase: 45, demandGrowth: 12.5, covidDip: false,
    topCompanies: ['OpenAI', 'DeepMind', 'Tesla', 'Nvidia', 'Anthropic', 'Apple'],
    topSkills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'CUDA', 'Transformers'],
  },
  'Full Stack Developer': {
    baseSalary: 98000, salaryGrowth: 4200,
    basePostings: 6800, demandBase: 70, demandGrowth: 4.8, covidDip: false,
    topCompanies: ['Startups', 'Accenture', 'IBM', 'Deloitte', 'Thoughtworks', 'Infosys'],
    topSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'TypeScript', 'REST APIs'],
  },
  'UX Designer': {
    baseSalary: 88000, salaryGrowth: 3800,
    basePostings: 3400, demandBase: 52, demandGrowth: 3.9, covidDip: true,
    topCompanies: ['Apple', 'Adobe', 'Figma', 'Airbnb', 'Spotify', 'Canva'],
    topSkills: ['Figma', 'User Research', 'Prototyping', 'Sketch', 'Usability', 'Design Systems'],
  },
  'Cybersecurity Analyst': {
    baseSalary: 105000, salaryGrowth: 5500,
    basePostings: 2900, demandBase: 50, demandGrowth: 9.2, covidDip: false,
    topCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Microsoft', 'IBM', 'Cisco', 'Splunk'],
    topSkills: ['SIEM', 'Penetration Testing', 'Network Security', 'Python', 'CISSP', 'SOC'],
  },
  'Cloud Architect': {
    baseSalary: 135000, salaryGrowth: 6500,
    basePostings: 1800, demandBase: 42, demandGrowth: 11.0, covidDip: false,
    topCompanies: ['AWS', 'Microsoft Azure', 'GCP', 'IBM', 'Oracle', 'Snowflake'],
    topSkills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Microservices'],
  },
  'Mobile Developer': {
    baseSalary: 102000, salaryGrowth: 4600,
    basePostings: 3200, demandBase: 56, demandGrowth: 5.8, covidDip: false,
    topCompanies: ['Apple', 'Google', 'Samsung', 'ByteDance', 'Lyft', 'DoorDash'],
    topSkills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS', 'Android'],
  },
};

const YEARS  = [2019, 2020, 2021, 2022, 2023, 2024];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Seasonal multipliers (Jan–Dec) — hiring peaks Q1 and Q3
const SEASONAL = [0.85, 0.88, 1.08, 1.12, 1.10, 0.95, 0.82, 0.85, 1.15, 1.18, 1.05, 0.75];

// COVID impact 2020 dip + 2021 recovery
const YEAR_FACTOR: Record<number, number> = {
  2019: 1.00,
  2020: 0.78, // COVID dip
  2021: 1.12, // recovery boom
  2022: 1.22, // tech boom
  2023: 0.92, // layoffs
  2024: 1.05, // stabilisation
};

async function main() {
  console.log('🌱 Seeding job market data...');

  // Clear existing market data
  await prisma.jobMarketData.deleteMany();

  const records: any[] = [];

  for (const [role, cfg] of Object.entries(ROLES)) {
    const yearIdx = { 2019: 0, 2020: 1, 2021: 2, 2022: 3, 2023: 4, 2024: 5 } as Record<number, number>;

    for (const year of YEARS) {
      const yf = cfg.covidDip ? YEAR_FACTOR[year] : (year === 2020 ? 0.88 : YEAR_FACTOR[year]);
      const yearsFromBase = yearIdx[year];
      const salary = Math.round(cfg.baseSalary + cfg.salaryGrowth * yearsFromBase);
      const demandBase = Math.min(99, cfg.demandBase + cfg.demandGrowth * yearsFromBase);

      for (const month of MONTHS) {
        const seasonal = SEASONAL[month - 1];
        const noise = 0.92 + Math.random() * 0.16; // ±8% random noise
        const postings = Math.round(cfg.basePostings * yf * seasonal * noise * (1 + yearsFromBase * 0.06));
        const demand = Math.min(99, Math.round(demandBase * yf * seasonal * noise * 10) / 10);

        records.push({
          role,
          year,
          month,
          jobPostings: Math.max(100, postings),
          avgSalaryUSD: Math.round(salary * (0.97 + Math.random() * 0.06)),
          topCompanies: JSON.stringify(cfg.topCompanies),
          topSkills: JSON.stringify(cfg.topSkills),
          demandIndex: Math.max(5, Math.min(99, demand)),
          location: 'Global',
        });
      }
    }
  }

  // Batch insert
  await prisma.jobMarketData.createMany({ data: records });
  console.log(`✅ Seeded ${records.length} market data records for ${Object.keys(ROLES).length} roles`);
  console.log('📊 Roles seeded:', Object.keys(ROLES).join(', '));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
