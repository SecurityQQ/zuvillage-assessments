import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name } = req.body;

    try {
      const newIdentity = await prisma.identity.create({
        data: { name },
      });
      res.status(201).json(newIdentity);
    } catch (error) {
      res.status(400).json({ error: 'Identity already exists' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
