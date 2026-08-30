import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET),
  );
}

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
      secure: true,
    });
  } else if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

/**
 * Upload buffer to Cloudinary
 * Handles images, videos, raw files automatically.
 */
export async function uploadToCloudinary({
  buffer,
  mimetype,
  originalname,
  folder = "ngo_uploads",
}) {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.",
    );
  }

  configureCloudinary();

  let resourceType = "auto";
  if (mimetype && mimetype.startsWith("video/")) {
    resourceType = "video";
  } else if (mimetype && mimetype.startsWith("image/")) {
    resourceType = "image";
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          storage: "cloudinary",
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by public_id
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!isCloudinaryConfigured()) return false;
  configureCloudinary();
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
}
