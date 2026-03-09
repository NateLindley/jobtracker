import { PrismaClient, Prisma, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up first
  await prisma.jobApplication.deleteMany();
  await prisma.tag.deleteMany();

  // Create tags
  const remote = await prisma.tag.create({ data: { name: 'remote' } });
  const senior = await prisma.tag.create({ data: { name: 'senior' } });
  const startup = await prisma.tag.create({ data: { name: 'startup' } });
  const enterprise = await prisma.tag.create({ data: { name: 'enterprise' } });

  // Create sample applications
  await prisma.jobApplication.createMany({
    data: [
      {
        company: 'Acme Corp',
        role: 'Senior Full-Stack Engineer',
        status: Status.INTERVIEWING,
        notes: {
          recruiterName: 'Jane Smith',
          rounds: ['phone screen', 'technical', 'system design'],
          salary: '$150k-$180k',
        },
      },
      {
        company: 'StartupXYZ',
        role: 'Lead Engineer',
        status: Status.APPLIED,
        notes: {
          recruiterName: 'Bob Jones',
          rounds: ['intro call'],
          salary: 'Equity heavy',
        },
      },
      {
        company: 'BigTech Inc',
        role: 'Staff Engineer',
        status: Status.REJECTED,
        notes: Prisma.JsonNull,
      },
    ],
  });

  // Connect tags to applications
  const acme = await prisma.jobApplication.findFirst({ where: { company: 'Acme Corp' } });
  const xyz = await prisma.jobApplication.findFirst({ where: { company: 'StartupXYZ' } });

  if (acme) {
    await prisma.jobApplication.update({
      where: { id: acme.id },
      data: { tags: { connect: [{ id: remote.id }, { id: senior.id }, { id: enterprise.id }] } },
    });
  }

  if (xyz) {
    await prisma.jobApplication.update({
      where: { id: xyz.id },
      data: { tags: { connect: [{ id: remote.id }, { id: startup.id }] } },
    });
  }

  console.log('✅ Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
