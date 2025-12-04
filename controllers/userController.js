import phonebookUser from "../model/userModel.js";
import { createUserService, deleteUserService, getAllUserService, getUserbyIdService, getUsersByLabelService, searchUserService, updateUserService } from "../services/userService.js";


export const createUser = async(req,res)=>{
    const {name,contact,adress,label,image} = req.body||{}
    try {
        if(!name||!contact){
            res.status(400).send("All fields are required")
        }

       const newUser = await createUserService(req.body, req.file);
       res.status(200).send(newUser)
    } catch (error) {
        res.status(500).send(error.message)
        
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await getAllUserService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Error fetching users");
    }
};


export const getUserbyId = async(req,res)=>{
    try {
          const { id } = req.params;
        const user = await getUserbyIdService(id)
        if(!user){
            res.status(400).send("User not found")
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send("Error fetching user")
        
    }
}

export const updateuser = async(req,res)=>{
    try {
      const updateData = await updateUserService(req.params.id , req.body,req.file)
        res.status(200).send(updateData)

    } catch (error) {
        res.status(404).send("Error updating user")
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await deleteUserService(userId);

        if (!user) {
            return res.status(404).send("Unable to find user");
        }

        res.status(200).send("User deleted successfully");
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
    res.status(500).send("Error searching searchUser:", error);
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