import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial doctor data...');

  // 1. Create or update Dr. Michael James
  const doctor1 = await prisma.doctor.upsert({
    where: { id: 'doc_1' },
    update: {},
    create: {
      id: 'doc_1',
      firstName: 'Michael',
      lastName: 'James',
      email: 'michael.james@hospital.com',
      specialty: 'Orthopedics - Joint Health',
    },
  });

  // 2. Create or update Dr. Sarah Patel
  const doctor2 = await prisma.doctor.upsert({
    where: { id: 'doc_2' },
    update: {},
    create: {
      id: 'doc_2',
      firstName: 'Sarah',
      lastName: 'Patel',
      email: 'sarah.patel@hospital.com',
      specialty: 'Cardiology - Interventional',
    },
  });

  console.log(
    `Seeding complete! Seeded doctors: Dr. ${doctor1.firstName} ${doctor1.lastName}, Dr. ${doctor2.firstName} ${doctor2.lastName}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });