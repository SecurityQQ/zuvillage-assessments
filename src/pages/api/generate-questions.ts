// Import the Prisma client and types
import { PrismaClient, Question, Identity } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import { NextApiRequest, NextApiResponse } from 'next/types';

const prisma = new PrismaClient();

interface Score {
  identityId: number;
  score: number;
}

interface FormattedQuestion {
  question: string;
  options: { text: string; points: Record<string, number> }[];
}

function parseScores(scores: any): Score[] {
  if (typeof scores === 'string') {
    try {
      return JSON.parse(scores) as Score[];
    } catch {
      return [];
    }
  }
  return scores as Score[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const numberOfQuestions = 3; // Number of questions to generate

    // Fetch all identities and create a map for quick lookup
    const identities: Identity[] = await prisma.identity.findMany();
    const identityMap = identities.reduce((acc: Record<number, string>, identity: Identity) => {
      acc[identity.id] = identity.name;
      return acc;
    }, {});

    // Fetch random questions from the database
    const questions: Question[] = await prisma.$queryRaw<Question[]>`
      SELECT * FROM "Question"
      ORDER BY RANDOM()
      LIMIT ${numberOfQuestions}
    `;

    // Format the questions to match the required structure
    const formattedQuestions: FormattedQuestion[] = questions.map((question) => {
      // Parse option1Scores and option2Scores
      const option1Scores = parseScores(question.option1Scores);
      const option2Scores = parseScores(question.option2Scores);

      // Calculate points for option1
      const option1Points = option1Scores.reduce((acc: Record<string, number>, score: Score) => {
        const identityName = identityMap[score.identityId];
        if (identityName) {
          acc[identityName] = (acc[identityName] || 0) + score.score;
        }
        return acc;
      }, {});

      // Calculate points for option2
      const option2Points = option2Scores.reduce((acc: Record<string, number>, score: Score) => {
        const identityName = identityMap[score.identityId];
        if (identityName) {
          acc[identityName] = (acc[identityName] || 0) + score.score;
        }
        return acc;
      }, {});

      return {
        question: question.text,
        options: [
          { text: question.option1, points: option1Points },
          { text: question.option2, points: option2Points },
        ],
      };
    });

    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
};
