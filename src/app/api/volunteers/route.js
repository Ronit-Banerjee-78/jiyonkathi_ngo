import pool, { isDbConnected } from "../../../../server/models/db.js";

let memoryVolunteers = [];

export async function GET() {
  try {
    if (!isDbConnected) {
      return Response.json({ success: true, volunteers: memoryVolunteers });
    }
    try {
      const result = await pool.query(
        "SELECT * FROM volunteers ORDER BY created_at DESC",
      );
      return Response.json({ success: true, volunteers: result.rows });
    } catch (dbErr) {
      return Response.json({ success: true, volunteers: memoryVolunteers });
    }
  } catch (error) {
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      program,
      location,
      availability,
      skills,
      motivation,
      status,
      image,
      isDdbmpbs,
    } = body || {};

    if (!name) {
      return Response.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    const newVol = {
      id: `v-${Date.now()}`,
      name,
      email: email || "",
      phone: phone || "",
      program: program || "General Volunteer",
      location: location || "",
      availability: availability || "Flexible",
      skills: skills || "",
      motivation: motivation || "",
      status: status || "pending",
      image: image || "",
      isDdbmpbs: Boolean(isDdbmpbs),
      createdAt: new Date().toISOString(),
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
          email TEXT,
          phone TEXT,
          program TEXT,
          location TEXT,
          availability TEXT,
          skills TEXT,
          motivation TEXT,
          status TEXT DEFAULT 'pending',
          image TEXT,
          is_ddbmpbs BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
      );

      const result = await pool.query(
        `INSERT INTO volunteers (id, name, email, phone, program, location, availability, skills, motivation, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          newVol.id,
          name,
          email || "",
          phone || "",
          program || "",
          location || "",
          availability || "",
          skills || "",
          motivation || "",
          status || "pending",
        ],
      );

      return Response.json({
        success: true,
        volunteer: { ...newVol, ...(result.rows[0] || {}) },
      });
    } catch (dbErr) {
      memoryVolunteers.unshift(newVol);
      return Response.json({ success: true, volunteer: newVol });
    }
  } catch (error) {
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
