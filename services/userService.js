import cloudinary from "../middleware/cloudinary.js";
import { handleImageUploadAndDelete } from "../middleware/imageUtils.js";
import phonebookUser from "../model/userModel.js";
import fs from 'fs'

export const createUserService = async (data, file) => {
  const { name, contact, adress, label } = data;

  try {
    let imageUrl = null;
    if (file) {
      imageUrl = await handleImageUploadAndDelete(null, file);
    }

    const newUser = new phonebookUser({
      name,
      contact,
      adress,
      label,
      image: imageUrl, 
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};



export const getAllUserService = async ()=>{
    try {
        return await phonebookUser.find({})
    } catch (error) {
        throw new error("Error fetching all users")
    }
}

export const getUserbyIdService = async (id)=>{
    try {

        if (user.imageId) {
      await cloudinary.v2.uploader.destroy(user.imageId);
    }
        return await phonebookUser.findById(id)
    } catch (error) {
        throw new error("Error fetching  User By id")
    }
}

export const deleteUserService = async (id) => {
  try {
    const user = await phonebookUser.findById(id);
    if (!user) throw new Error("User not found");
    if (user.image) {
      const imageUrlParts = user.image.split('/');
      const imageId = imageUrlParts[imageUrlParts.length - 1].split('.')[0]; 
      await cloudinary.v2.uploader.destroy(imageId);
      //   await handleImageUploadAndDelete(user.image, null); 
    }

    return await phonebookUser.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};


export const updateUserService = async (id, updateData, file) => {
  try {
    const user = await phonebookUser.findById(id);
    if (!user) throw new Error("User not found");

    const imageUrl = await handleImageUploadAndDelete(user.image, file);
    const updatedUser = await phonebookUser.findByIdAndUpdate(
      id,
      { ...updateData, image: imageUrl },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchUserService = async (name) => {
  if (!name || name.trim().length === 0) {
    throw new Error("Search name is required.");
  }
  try {
    return await phonebookUser.find({
      name: { $regex: name, $options: 'i' } 
    });
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getUsersByLabelService = async (label) => {
  try {
    const validLabels = ['Work', 'Friend', 'Family'];
    if (!validLabels.includes(label)) {
throw new Error('Invalid label');
    }
    return await phonebookUser.find({ label });

  } catch (error) {
    throw new Error(`Error fetching ${error.message}`);
  }
};


export const toggleBookmark = async (id) => {
    try {
        const contact = await phonebookUser.findById(id);
        if (!contact) {
            throw new Error('Contact not found');
        }

        contact.bookmark = !contact.bookmark;
        await contact.save();
        return contact;
    } catch (error) {
        throw new Error(error.message);
    }
};






