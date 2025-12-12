import cloudinary from "../middleware/cloudinary.js";
import { deleteImageFromCloudinary, handleImageUploadAndDelete } from "../middleware/imageUtils.js";
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
export const getAllUserService = async (query) => {
  try {
    const searchQuery = {};

    if (query.id) {
      searchQuery._id = query.id;
    }

    if (query.name) {
      searchQuery.name = { $regex: query.name, $options: "i" };
    }

    if (query.label) {
      const validLabels = ["Work", "Friend", "Family"];
      if (!validLabels.includes(query.label)) {
        throw new Error("Invalid label");
      }
      searchQuery.label = query.label;
    }
    const count = await phonebookUser.countDocuments(searchQuery);
    const users = await phonebookUser.find(searchQuery);

    return {
      count,
      data: users,
    };
  } catch (error) {
    throw new Error(`Error fetching user(s): ${error.message}`);
  }
};

export const deleteUserService = async (id) => {
  try {
    const user = await phonebookUser.findById(id);
    if (!user) throw new Error("User not found");
    if (user.image) {
      await deleteImageFromCloudinary(user.image)

    }
    return await phonebookUser.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};
export const updateUserOrToggleBookmarkService = async (id, updateData, file, toggleBookmark = false) => {
    try {
        const user = await phonebookUser.findById(id);
        if (!user) throw new Error("User not found");

        if (toggleBookmark) {
            user.bookmark = !user.bookmark;
            await user.save();
            return user; 
        }
        const { bookmark, ...filteredUpdateData } = updateData;
        let imageUrl = user.image;
        if (!file && (updateData.image === null || updateData.image === "")) {
            if (user.image) {
                await deleteImageFromCloudinary(user.image); 
            }
            imageUrl = null; 
        } else if (file) {
            imageUrl = await handleImageUploadAndDelete(user.image, file); 
        }

        const updatedUser = await phonebookUser.findByIdAndUpdate(
            id,
            { ...filteredUpdateData, image: imageUrl },
            {
                new: true,
                runValidators: true,
            }
        );

        return updatedUser;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const paginationService = async (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const filter = {};
  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: "i" }; 
  }
  if (req.query.label) {
    filter.label = req.query.label;
  }

  try {
    const count = await phonebookUser.countDocuments(filter);
    const allContacts = await phonebookUser.find(filter)      
      .sort({ bookmark: -1, name: 1 })
      .collation({ locale: "en", strength: 2 }) 
      .skip(startIndex) 
      .limit(limit);

    const totalPages = Math.ceil(count / limit);

    return {
      currentPage: page,
      totalPages,
      totalCount: count,
      data: allContacts,
    };
  } catch (error) {
    throw new Error(`Error with pagination: ${error.message}`);
  }
};



