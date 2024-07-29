import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Answer = {
  question: string;
  optionText: string;
};

type QuestionVotes = {
  [question: string]: {
    [optionText: string]: number;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const assessments = await prisma.assessment.findMany({
      select: {
        answersHistory: true,
      },
    });

    const questionVotes = assessments.reduce((acc: QuestionVotes, assessment) => {
      if (assessment.answersHistory && Array.isArray(assessment.answersHistory)) {
        assessment.answersHistory.forEach((answer: any) => {
          if (answer && answer.question && answer.optionText) {
            if (!acc[answer.question]) {
              acc[answer.question] = {};
            }
            if (!acc[answer.question][answer.optionText]) {
              acc[answer.question][answer.optionText] = 0;
            }
            acc[answer.question][answer.optionText] += 1;
          }
        });
      }
      return acc;
    }, {});



    const questionVotesArray = Object.entries(questionVotes).map(([question, options]) => ({
      question,
      options: Object.entries(options).map(([text, count]) => ({ text, count })),
    }));

    res.status(200).json(questionVotesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching question votes data' });
  }
};
