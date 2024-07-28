import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const assessments = await prisma.assessment.findMany({
      select: {
        createdAt: true,
      },
    });

    const assessmentsPerDay = assessments.reduce((acc: any, assessment) => {
      const date = assessment.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const assessmentData = Object.entries(assessmentsPerDay).map(([date, count]) => ({
      date,
      totalAssessments: count,
    }));

    res.status(200).json(assessmentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching assessment data' });
  }
};
