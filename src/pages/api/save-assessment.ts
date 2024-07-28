import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, scores, answersHistory } = req.body;

    // Save the assessment results to the database
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        scores,
        answersHistory,
      },
    });

    res.status(200).json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving assessment results' });
  }
};
