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



// export const getAllUserService = async () => {
//   try {
//     const count = await phonebookUser.countDocuments({});
//     const users = await phonebookUser.find({});
//     return {
//       count,
//       data: users,
//     };
//   } catch (error) {
//     throw new Error("Error fetching all users");
//   }
// };
export const getAllUserService = async (id) => {
try {
  console.log(id);
  
    if (id) {
      return await phonebookUser.findById(id);
    } else {
      const count = await phonebookUser.countDocuments({});
      const users = await phonebookUser.find({});
      return {
        count,
        data: users,
      };
    }
  } catch (error) {
    throw new Error("Error fetching user(s)");
  }
};


// export const getUserbyIdService = async (id)=>{
//     try {
//         return await phonebookUser.findById(id)
//     } catch (error) {
//         throw new error("Error fetching  User By id")
//     }
// }

export const deleteUserService = async (id) => {
  try {
    const user = await phonebookUser.findById(id);
    if (!user) throw new Error("User not found");
    if (user.image) {
      // const imageUrlParts = user.image.split('/');
      // const imageId = imageUrlParts[imageUrlParts.length - 1].split('.')[0]; 
      // await cloudinary.v2.uploader.destroy(imageId);

      await deleteImageFromCloudinary(user.image)

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
    let imageUrl = user.image;
    if (!file && (updateData.image === null || updateData.image === "")) {
      if (user.image) {
        // const parts = user.image.split("/");
        // const publicId = parts[parts.length - 1].split(".")[0];
        // await cloudinary.v2.uploader.destroy(publicId);

        await deleteImageFromCloudinary(user.image)
      }
      imageUrl = null;
    } else if (file) {
      imageUrl = await handleImageUploadAndDelete(user.image, file);
    }
    const updatedUser = await phonebookUser.findByIdAndUpdate(
      id,
      { ...updateData, image: imageUrl },
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

export const searchUserService = async (name) => {
  if (!name || name.trim().length === 0) {
    throw new Error("Search name is required.");
  }
  try {
    const count = await phonebookUser.countDocuments({
      name: { $regex: name, $options: "i" },
    });
    const users = await phonebookUser.find({
      name: { $regex: name, $options: "i" },
    });
    return {
      count,
      data: users,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getUsersByLabelService = async (label) => {
  try {
    const validLabels = ["Work", "Friend", "Family"];
    if (!validLabels.includes(label)) {
      throw new Error("Invalid label");
    }

    const count = await phonebookUser.countDocuments({ label });
    const users = await phonebookUser.find({ label });

    return {
      count,
      data: users,
    };
  } catch (error) {
    throw new Error(`Error fetching users by label: ${error.message}`);
  }
};



export const toggleBookmarkService = async (id) => {
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


export const paginationService = async (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const lastIndex = page * limit;
  const startIndex = lastIndex - limit;

  try {
    const count = await phonebookUser.countDocuments();
    const users = await phonebookUser.find()
      .skip(startIndex)
      .limit(limit)

      
    const totalPages = Math.ceil(count / limit);

    return {
      currentPage: page,
      totalPages,
      totalCount: count,
      data: users,
    };
  } catch (error) {
    throw new Error(`Error with pagination: ${error.message}`);
  }
};




