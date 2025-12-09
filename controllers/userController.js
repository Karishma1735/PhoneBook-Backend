import phonebookUser from "../model/userModel.js";
import { createUserService, deleteUserService, getAllUserService, getUsersByLabelService, paginationService, searchUserService, updateUserOrToggleBookmarkService } from "../services/userService.js";


export const createUser = async(req,res)=>{
    const {name,contact,adress,label,image} = req.body||{}
    try {

       const newUser = await createUserService(req.body, req.file);
       res.status(200).send(newUser)
    } catch (error) {
        res.status(500).send(error.message)
        
    }
}

export const getAllUser = async (req, res) => {
  try {
    const { id } = req.query;
    const users = await getAllUserService(id);

    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user(s)" });
  }
};

// export const updateuser = async(req,res)=>{
//     try {
//       const updateData = await updateUserService(req.params.id , req.body,req.file)
//         res.status(200).send(updateData)

//     } catch (error) {
//         res.status(404).send({
//             message:"Error updating users",
//             error:error.message
//         })
//     }
// }

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
            user: user 
        });
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
};


export const searchUser = async (req, res) => {
  try {
    const { name } = req.query;
    const users = await searchUserService(name);
    if (users.length === 0) {
      return res.status(404).send("No users found." );
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
        message:"Error searching user"
    });
  }
};

export const filterBylabel = async(req,res)=>{
    try {
        const {label} = req.query;
        const users = await getUsersByLabelService(label)
        return res.status(200).send(users)
    } catch (error) {
        res.status(500).send("Error filter by label:", error);
    }
}

// export const toggleBookmark = async(req,res) =>{
//     try {
//         const {id} = req.params
//         const updatedBookmark = await toggleBookmarkService(id)
//         res.status(200).send({
//             message:"Bookmark updated successfully",
//             updatedBookmark:updatedBookmark
//         })

        
//     } catch (error) {
//         res.status(500).send("Unable to toggle bookmark")
        
//     }
// }

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

