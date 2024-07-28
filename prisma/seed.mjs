import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const identities = [
  { name: "Truth" },
  { name: "Independent Thinking" },
  { name: "Personal Responsibility" },
  { name: "Trustworthiness" },
  { name: "Careful Tech Use" },
  { name: "Privacy" },
  { name: "Personal Freedom" },
  { name: "Logical Thinking" },
  { name: "Multiple Perspectives" },
  { name: "Thinking Beyond Logic" },
  { name: "Human Nature" },
  { name: "Tech Innovation" }
];

async function main() {
  for (const identity of identities) {
    await prisma.identity.upsert({
      where: { name: identity.name },
      update: {},
      create: identity
    });
  }
  console.log('Seeded identities');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
