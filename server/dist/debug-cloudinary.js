"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
});
console.log('Cloudinary v2 object keys:', Object.keys(cloudinary_1.v2));
console.log('Cloudinary v2.uploader exists:', !!cloudinary_1.v2.uploader);
console.log('Cloudinary v2.uploader.upload_stream exists:', !!(cloudinary_1.v2.uploader && cloudinary_1.v2.uploader.upload_stream));
try {
    const stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
        if (error)
            console.error('Stream error:', error);
        else
            console.log('Stream result:', result);
    });
    console.log('Successfully created upload_stream');
}
catch (e) {
    console.error('Error creating upload_stream:', e);
}
