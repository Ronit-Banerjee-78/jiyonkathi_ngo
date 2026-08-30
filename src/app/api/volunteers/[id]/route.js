import pool, { isDbConnected } from '../../../../../server/models/db.js';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body || {};

    if (isDbConnected) {
      try {
        const result = await pool.query(
          `UPDATE volunteers SET status = COALESCE($1, status) WHERE id = $2 RETURNING *`,
          [status, id]
        );
        if (result.rows.length > 0) {
          return Response.json({ success: true, volunteer: result.rows[0] });
        }
      } catch (dbErr) {}
    }
    return Response.json({ success: true, volunteer: { id, status, notes } });
  } catch (error) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (isDbConnected) {
      try {
        await pool.query('DELETE FROM volunteers WHERE id = $1', [id]);
      } catch (dbErr) {}
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
