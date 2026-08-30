import pool, { isDbConnected } from '../../../../server/models/db.js';

const memoryFiles = new Map();
let nextFileId = 1;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalname = file.name || 'uploaded_file';
    const mimetype = file.type || 'application/octet-stream';

    if (isDbConnected) {
      try {
        const result = await pool.query(
          'INSERT INTO site_files (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id',
          [originalname, mimetype, buffer]
        );
        return Response.json({ success: true, fileId: result.rows[0].id, url: `/api/files/${result.rows[0].id}`, storage: 'postgres' });
      } catch (dbErr) {
        console.warn("DB upload error:", dbErr.message);
      }
    }

    const fileId = nextFileId++;
    memoryFiles.set(String(fileId), { filename: originalname, mimetype, data: buffer });
    return Response.json({ success: true, fileId, url: `/api/files/${fileId}`, storage: 'memory' });
  } catch (error) {
    console.error("Error uploading file:", error);
    return Response.json({ success: false, error: 'Server error during upload' }, { status: 500 });
  }
}
