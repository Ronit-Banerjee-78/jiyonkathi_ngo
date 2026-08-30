import pool, { isDbConnected } from '../../../../server/models/db.js';

let memorySettings = null;

export async function GET() {
  try {
    if (!isDbConnected) {
      return Response.json({ success: true, data: memorySettings });
    }
    const result = await pool.query('SELECT data FROM site_settings ORDER BY id DESC LIMIT 1');
    if (result.rows.length > 0) {
      return Response.json({ success: true, data: result.rows[0].data });
    } else {
      return Response.json({ success: true, data: null });
    }
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    return Response.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data } = body || {};
    if (!data) {
      return Response.json({ success: false, error: 'Data is required' }, { status: 400 });
    }

    if (!isDbConnected) {
      memorySettings = data;
      return Response.json({ success: true, note: 'Saved to memory fallback (DB disconnected)' });
    }

    const jsonString = JSON.stringify(data).replace(/'/g, "''");
    await pool.query(`INSERT INTO site_settings (data) VALUES ('${jsonString}')`);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error.message);
    return Response.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
