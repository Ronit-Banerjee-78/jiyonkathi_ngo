import pool, { isDbConnected } from '../../../../../server/models/db.js';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    let file = null;

    if (isDbConnected) {
      try {
        const result = await pool.query('SELECT filename, mimetype, data FROM site_files WHERE id = $1', [id]);
        if (result.rows.length > 0) {
          file = result.rows[0];
        }
      } catch (err) {}
    }

    if (!file) {
      return Response.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    return new Response(file.data, {
      headers: {
        'Content-Type': file.mimetype,
        'Content-Disposition': `inline; filename="${file.filename}"`
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
