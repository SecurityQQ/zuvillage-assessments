import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, votes } = req.body;

    try {
      const updatedIdentity = await prisma.identity.update({
        where: { name },
        data: { votes },
      });
      res.status(200).json(updatedIdentity);
    } catch (error) {
      res.status(500).json({ error: 'Error updating identity votes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
