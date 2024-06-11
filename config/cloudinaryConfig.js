const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME | "rohithashok",
  api_key: process.env.CLOUDINARY_API_KEY | "193519432451979",
  api_secret: process.env.CLOUDINARY_API_SECRET | "unkhXNfPQJJEjvrQN1nkwMOnGgU",
});

module.exports = cloudinary;
