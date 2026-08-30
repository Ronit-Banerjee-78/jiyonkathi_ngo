import express from 'express';
import pool, { isDbConnected, ensureDbConnected } from '../models/db.js';

const router = express.Router();

let memoryVolunteers = [
  {
    id: 'v-1',
    name: 'Anirban Mukherjee',
    email: 'anirban.m@gmail.com',
    phone: '+91 98301 23456',
    program: 'Organic Farming & Soil Testing',
    location: 'Kolkata, West Bengal',
    availability: 'Weekends',
    skills: 'Organic farming, Soil testing, Photography',
    motivation: 'I want to contribute my weekend time towards seed conservation and sustainable village living.',
    status: 'approved',
    isDdbmpbs: true,
    createdAt: new Date('2026-07-28').toISOString()
  },
  {
    id: 'v-2',
    name: 'Sutapa Sarkar',
    email: 'sutapa.s@yahoo.com',
    phone: '+91 94332 87654',
    program: 'Auxiliary Education Center',
    location: 'Burdwan, West Bengal',
    availability: 'Seasonal / Full-time',
    skills: 'Teaching primary children, Bengali literature, Music',
    motivation: 'Passionate about teaching village youth about nature and local heritage.',
    status: 'approved',
    isDdbmpbs: false,
    createdAt: new Date('2026-07-30').toISOString()
  },
  {
    id: 'v-3',
    name: 'Tanmoy Chattopadhyay',
    email: 'tanmoy.c@gmail.com',
    phone: '+91 91234 56789',
    program: 'Indigenous Seed Conservation',
    location: 'Durgapur, West Bengal',
    availability: 'Flexible / On-call',
    skills: 'Seed banking, Agroforestry documentation',
    motivation: 'Interested in working closely with DDBMPBS and Jiyonkathi field activities.',
    status: 'pending',
    isDdbmpbs: true,
    createdAt: new Date('2026-08-10').toISOString()
  }
];

// Helper: Auto-cleanup rejected volunteers older than 7 days
const cleanupExpiredRejections = () => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  memoryVolunteers = memoryVolunteers.filter((v) => {
    if (v.status === 'rejected' && v.rejectedAt) {
      return new Date(v.rejectedAt).getTime() > sevenDaysAgo;
    }
    return true;
  });
};

// GET /api/volunteers
router.get('/', async (req, res) => {
  try {
    cleanupExpiredRejections();
    await ensureDbConnected();

    if (!isDbConnected) {
      return res.json({ success: true, volunteers: memoryVolunteers });
    }

    try {
      // Clean up in DB as well
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      await pool.query(
        "DELETE FROM volunteers WHERE status = 'rejected' AND rejected_at IS NOT NULL AND rejected_at < $1",
        [sevenDaysAgo]
      );

      const result = await pool.query('SELECT * FROM volunteers ORDER BY created_at DESC');
      const mapped = result.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        program: r.program,
        location: r.location,
        availability: r.availability,
        skills: r.skills,
        motivation: r.motivation,
        status: r.status || 'pending',
        isDdbmpbs: Boolean(r.is_ddbmpbs),
        rejectedAt: r.rejected_at,
        createdAt: r.created_at
      }));
      res.json({ success: true, volunteers: mapped });
    } catch (dbErr) {
      console.warn("DB query failed for volunteers, using memory fallback:", dbErr.message);
      res.json({ success: true, volunteers: memoryVolunteers });
    }
  } catch (error) {
    console.error("Error fetching volunteers:", error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/volunteers
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, program, location, availability, skills, motivation, isDdbmpbs } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and Email are required' });
    }

    const newVol = {
      id: `v-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      program: program || 'General Volunteer',
      location: location || '',
      availability: availability || 'Flexible',
      skills: skills || '',
      motivation: motivation || '',
      status: 'pending',
      isDdbmpbs: Boolean(isDdbmpbs),
      rejectedAt: null,
      createdAt: new Date().toISOString()
    };

    memoryVolunteers.unshift(newVol);

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          `CREATE TABLE IF NOT EXISTS volunteers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            program TEXT,
            location TEXT,
            availability TEXT,
            skills TEXT,
            motivation TEXT,
            status TEXT DEFAULT 'pending',
            is_ddbmpbs BOOLEAN DEFAULT false,
            rejected_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        );

        await pool.query(
          `INSERT INTO volunteers (id, name, email, phone, program, location, availability, skills, motivation, status, is_ddbmpbs, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            newVol.id,
            name,
            email,
            phone || '',
            program || '',
            location || '',
            availability || '',
            skills || '',
            motivation || '',
            'pending',
            Boolean(isDdbmpbs),
            newVol.createdAt
          ]
        );
      } catch (dbErr) {
        console.warn("DB insert failed for volunteer, using memory fallback:", dbErr.message);
      }
    }

    res.json({ success: true, volunteer: newVol });
  } catch (error) {
    console.error("Error creating volunteer application:", error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/volunteers/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isDdbmpbs } = req.body;

    const rejectedAt = status === 'rejected' ? new Date().toISOString() : null;

    const idx = memoryVolunteers.findIndex(v => v.id === id);
    if (idx !== -1) {
      memoryVolunteers[idx] = {
        ...memoryVolunteers[idx],
        ...(status ? { status } : {}),
        ...(isDdbmpbs !== undefined ? { isDdbmpbs: Boolean(isDdbmpbs) } : {}),
        ...(status === 'rejected' ? { rejectedAt } : (status === 'approved' ? { rejectedAt: null } : {}))
      };
    }

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          `UPDATE volunteers 
           SET status = COALESCE($1, status),
               is_ddbmpbs = COALESCE($2, is_ddbmpbs),
               rejected_at = $3
           WHERE id = $4`,
          [status, isDdbmpbs !== undefined ? Boolean(isDdbmpbs) : null, rejectedAt, id]
        );
      } catch (dbErr) {
        console.warn("DB update error for volunteer:", dbErr.message);
      }
    }

    const updated = memoryVolunteers.find(v => v.id === id);
    res.json({ success: true, volunteer: updated });
  } catch (error) {
    console.error("Error updating volunteer:", error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/volunteers/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    memoryVolunteers = memoryVolunteers.filter(v => v.id !== id);

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query('DELETE FROM volunteers WHERE id = $1', [id]);
      } catch (dbErr) {
        console.warn("DB delete failed for volunteer:", dbErr.message);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting volunteer:", error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export { router as volunteerRoutes };
