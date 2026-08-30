import pool, { isDbConnected } from '../../../../server/models/db.js';

let memoryVolunteers = [
  {
    id: 'v-1',
    name: 'Anirban Mukherjee',
    email: 'anirban.m@gmail.com',
    phone: '+91 98301 23456',
    program: 'Indigenous Farming & Seed Conservation',
    location: 'Kolkata, West Bengal',
    availability: 'Weekends',
    skills: 'Organic farming, Soil testing, Photography',
    motivation: 'I want to contribute my weekend time towards seed conservation and sustainable village living.',
    status: 'pending',
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
    createdAt: new Date('2026-07-30').toISOString()
  }
];

export async function GET() {
  try {
    if (!isDbConnected) {
      return Response.json({ success: true, volunteers: memoryVolunteers });
    }
    try {
      const result = await pool.query('SELECT * FROM volunteers ORDER BY created_at DESC');
      return Response.json({ success: true, volunteers: result.rows });
    } catch (dbErr) {
      return Response.json({ success: true, volunteers: memoryVolunteers });
    }
  } catch (error) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, program, location, availability, skills, motivation } = body || {};

    if (!name || !email) {
      return Response.json({ success: false, error: 'Name and Email are required' }, { status: 400 });
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
      createdAt: new Date().toISOString()
    };

    if (!isDbConnected) {
      memoryVolunteers.unshift(newVol);
      return Response.json({ success: true, volunteer: newVol });
    }

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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
      );

      const result = await pool.query(
        `INSERT INTO volunteers (id, name, email, phone, program, location, availability, skills, motivation, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [newVol.id, name, email, phone || '', program || '', location || '', availability || '', skills || '', motivation || '', 'pending']
      );

      return Response.json({ success: true, volunteer: result.rows[0] });
    } catch (dbErr) {
      memoryVolunteers.unshift(newVol);
      return Response.json({ success: true, volunteer: newVol });
    }
  } catch (error) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
