const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

if (process.env.Cloud_Name && process.env.Cloud_Api_Key && process.env.Cloud_Secret) {
    cloudinary.config({
        cloud_name: process.env.Cloud_Name,
        api_key: process.env.Cloud_Api_Key,
        api_secret: process.env.Cloud_Secret
    });
} else {
    console.warn('Cloudinary credentials not found. Image uploads will not work.');
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png',
        public_id: (req, file) => file.originalname.split('.')[0] + ""
    },
});

const cloudinaryFileUploader = multer({ storage: storage });

module.exports = {
    cloudinaryFileUploader
}

