/**
 * Firebase Cloud Storage Service
 * Low-cost storage driver for images & video uploads.
 * Gracefully falls back to local PostgreSQL / Memory storage if Firebase env vars are not set.
 */

import dotenv from 'dotenv';
dotenv.config();

export const isFirebaseConfigured = () => {
  return Boolean(process.env.FIREBASE_STORAGE_BUCKET && process.env.FIREBASE_PROJECT_ID);
};

export async function uploadToFirebaseStorage({ filename, mimetype, buffer }) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase Storage credentials are not configured in environment variables.");
  }

  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const encodedPath = encodeURIComponent(`uploads/${Date.now()}_${filename}`);
  
  // Use Firebase Storage REST API with download token
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodedPath}`;
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': mimetype,
    },
    body: buffer,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Firebase upload failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const mediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;

  return {
    success: true,
    url: mediaUrl,
    filename: data.name,
    bucket: data.bucket,
  };
}
