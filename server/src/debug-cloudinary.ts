
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
});

console.log('Cloudinary v2 object keys:', Object.keys(cloudinary));
console.log('Cloudinary v2.uploader exists:', !!cloudinary.uploader);
console.log('Cloudinary v2.uploader.upload_stream exists:', !!(cloudinary.uploader && cloudinary.uploader.upload_stream));

try {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) console.error('Stream error:', error);
        else console.log('Stream result:', result);
    });
    console.log('Successfully created upload_stream');
} catch (e) {
    console.error('Error creating upload_stream:', e);
}
