import phonebookUser from "../model/userModel.js";
import { createUserService, deleteUserService, getAllUserService, paginationService, updateUserOrToggleBookmarkService } from "../services/userService.js";

export const createUser = async (req, res) => {
  const { name, contact, adress, label, image } = req.body || {};

  const allowedFields = ['name', 'contact', 'adress', 'label', 'image'];
  const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));

  if (invalidFields.length > 0) {
    return res.status(400).json({ messages: [`Invalid fields: ${invalidFields.join(', ')}`] });
  }

  try {
    const newUser = await createUserService(req.body, req.file);
    return res.status(201).json(newUser);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        messages: ["Please enter unique contact number !!! Current number already exists."]
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ messages });
    }

    return res.status(500).json({ messages: [error.message || "Something went wrong!"] });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const { id, name, label } = req.query;
    const users = await getAllUserService({ id, name, label });

    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "User(s) not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user(s)", error: error.message });
  }
};

export const updateUserOrToggleBookmarkController = async (req, res) => {
    try {
        const { id } = req.params;
        const { toggleBookmark } = req.query;

        if (toggleBookmark === 'true') {
            const updatedBookmark = await updateUserOrToggleBookmarkService(id, null, null, true);
            return res.status(200).send({
                message: "Bookmark updated successfully",
                updatedBookmark: updatedBookmark
            });
        }
        const updateData = await updateUserOrToggleBookmarkService(id, req.body, req.file);
        return res.status(200).send({
            message: "User updated successfully",
            updatedUser: updateData
        });
    } catch (error) {
        return res.status(500).send({
            message: "Error processing the request",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await deleteUserService(userId);

        if (!user) {
            return res.status(404).send("Unable to find user");
        }

          res.status(200).send({
            message: "User deleted successfully",
            user: user.name
        });
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
};

export const pagination = async (req, res) => {
  try {

    const result = await paginationService(req);

    return res.status(200).send({
      success: true,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalCount: result.totalCount,
      data: result.data,
    });
  } catch (error) {
    console.error("Pagination service error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

