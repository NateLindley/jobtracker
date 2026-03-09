import { Router, Request, Response } from 'express';
import { PrismaClient, Status } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/applications?status=APPLIED
// Demonstrates: filtered queries, JOIN via include, index usage
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const applications = await prisma.jobApplication.findMany({
      where: status ? { status: status as Status } : undefined,
      include: { tags: true }, // JOIN — Prisma handles the many-to-many
      orderBy: { appliedAt: 'desc' },
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/applications/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: Number(req.params.id) },
      include: { tags: true },
    });

    if (!application) return res.status(404).json({ error: 'Not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// POST /api/applications
// Demonstrates: create with relation (tags), JSONB write
router.post('/', async (req: Request, res: Response) => {
  try {
    const { company, role, status, notes, tags } = req.body;

    const application = await prisma.jobApplication.create({
      data: {
        company,
        role,
        status: status ?? Status.APPLIED,
        notes: notes ?? null, // JSONB — accepts any object
        tags: {
          connectOrCreate: (tags ?? []).map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { tags: true },
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// PATCH /api/applications/:id
// Demonstrates: partial update, JSONB update, tag reconnection
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { company, role, status, notes, tags } = req.body;
    const id = Number(req.params.id);

    // Use a transaction to update app + reset tags atomically
    // This is great to mention in interviews!
    const updated = await prisma.$transaction(async (tx) => {
      // Disconnect all existing tags first
      await tx.jobApplication.update({
        where: { id },
        data: { tags: { set: [] } },
      });

      // Then apply the full update
      return tx.jobApplication.update({
        where: { id },
        data: {
          ...(company && { company }),
          ...(role && { role }),
          ...(status && { status }),
          ...(notes !== undefined && { notes }),
          ...(tags && {
            tags: {
              connectOrCreate: tags.map((name: string) => ({
                where: { name },
                create: { name },
              })),
            },
          }),
        },
        include: { tags: true },
      });
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.jobApplication.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export { router as applicationsRouter };
