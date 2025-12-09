
import fs from "fs";
import cloudinary from "../middleware/cloudinary.js";

export const handleImageUploadAndDelete = async (currentImageUrl, newImage) => {
  let imageUrl = currentImageUrl;
  if (newImage) {
    if (currentImageUrl) {
      const imageUrlParts = currentImageUrl.split('/');
      const imageId = imageUrlParts[imageUrlParts.length - 1].split('.')[0]; 
      await cloudinary.v2.uploader.destroy(imageId);
    }

    const result = await cloudinary.v2.uploader.upload(newImage.path);
    imageUrl = result.secure_url; 

     try {
      fs.unlinkSync(newImage.path); 
      console.log(`Local file  deleted.`);
    } catch (err) {
      console.error(`Error deleting local file:`, err);
    }
  }

  return imageUrl;
};



export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const imageUrlParts = imageUrl.split('/');
    const imageId = imageUrlParts[imageUrlParts.length - 1].split('.')[0]; 
    await cloudinary.v2.uploader.destroy(imageId);
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

