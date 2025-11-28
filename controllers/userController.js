import phonebookUser from "../model/userModel.js";


export const createUser = async(req,res)=>{
    const {name,contact,adress,label} = req.body||{}
    try {
        if(!name||!contact||!adress){
            res.status(400).send("All fields are required")
        }
         const image = req.file?req.file.filename:null
        const newUser = new phonebookUser({name,contact,adress,label,image})
        newUser.save()
        res.status(200).send(newUser)
    } catch (error) {
        res.status(500).send(error.message)
        
    }
}

export const getAllUser = async(req,res)=>{
    try {
        const users = await phonebookUser.find({})
    res.status(200).json(users)
    } catch (error) {
        res.status(404).send("Error fetching users")
        
    }
    
}


export const getUserbyId = async(req,res)=>{
    try {
        const user = await phonebookUser.findById(req.params.id)
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
        const {name,contact,adress,label} = req.body
        const updateduser = {}
        if(name) updateduser.name = name
        if(contact) updateduser.contact= contact
        if(adress) updateduser.adress = adress
        if(label) updateduser.label = label

        const updatedData = await phonebookUser.findByIdAndUpdate(
            req.params.id,
            updateduser,
            {new:true}
        )

        res.status(200).send(updatedData)


    } catch (error) {
        res.status(404).send("Error updating user")
        
    }
}

export const deleteUser = async(req,res)=>{
    try {
          const user = await phonebookUser.findByIdAndDelete(req.params.id)
    if(!user){
        res.status(404).send("Unable to find user")
    }
    res.status(200).send("User deleted successfully")
    } catch (error) {
        res.status(400).send("Error deleting user")
    }
  
}

export const searchUser= async(req,res)=>{
   try {
    const {name} = req.query

    const users = await phonebookUser.find({
        name:{$regex:name,$option:i}
    })
    res.status(200).send(users)
   } catch (error) {
    res.status(500).send(error.message)
   }
}