import mongoose from 'mongoose'


const phonebookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true,
        unique:true,
    },
    adress:{
        type:String
    },
    label:{
        type:String,
        enum:['Work','Friend','Family'],
        default:"Friend"
    },
      deleted: 
      { 
        type: Boolean, 
        default: false }, 
     image: {
        type: String,
     }
})

const phonebookUser = mongoose.model('Phonebook',phonebookSchema)
export default phonebookUser;