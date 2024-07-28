import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch all assessments
    const assessments = await prisma.assessment.findMany();

    // Calculate the total scores for each identity
    const totalScores = assessments.reduce((acc: Record<string, number>, assessment) => {
      const scores = assessment.scores as Record<string, number>;
      for (const [identity, score] of Object.entries(scores)) {
        acc[identity] = (acc[identity] || 0) + score;
      }
      return acc;
    }, {});

    // Sort identities by total score
    const sortedIdentities = Object.entries(totalScores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([identity]) => identity);

    res.status(200).json({ totalScores, sortedIdentities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching summary data' });
  }
};
