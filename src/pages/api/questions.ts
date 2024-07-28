import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { text, option1, option2, option1Scores, option2Scores } = req.body;

    try {
      const newQuestion = await prisma.question.create({
        data: {
          text,
          option1,
          option2,
          option1Scores: JSON.stringify(option1Scores),
          option2Scores: JSON.stringify(option2Scores),
          identities: {
            create: [
              ...option1Scores.map((score: { identityId: number }) => ({
                identityId: score.identityId,
              })),
              ...option2Scores.map((score: { identityId: number }) => ({
                identityId: score.identityId,
              })),
            ],
          },
        },
      });

      res.status(201).json(newQuestion);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Error creating question' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
