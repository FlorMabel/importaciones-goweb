import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.resolve(__dirname, '../public/images');

async function uploadImage(filePath, folderPath) {
  try {
    // Determine the Cloudinary folder structure based on local folders
    const relativePath = path.relative(IMAGES_DIR, path.dirname(filePath));
    const cloudFolder = relativePath ? `goshopping/${relativePath}` : 'goshopping';
    
    // Upload the image
    const result = await cloudinary.uploader.upload(filePath, {
      folder: cloudFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    
    console.log(`✅ Uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name)) {
      await uploadImage(fullPath);
      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}

async function run() {
  console.log('🚀 Starting image migration to Cloudinary...');
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Missing Cloudinary credentials in .env file.');
    process.exit(1);
  }
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }
  
  await processDirectory(IMAGES_DIR);
  
  console.log('🎉 Image migration complete!');
}

run().catch(console.error);
