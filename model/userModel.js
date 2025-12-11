import mongoose from 'mongoose'

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
    },
    contact: {
        type: String,
        required: [true, 'Contact  is required.'],
        unique: [true, 'Please enter unique contact number !!!Current number already exists.'],
        
        validate: {
            validator: function(value) {
                return /^\d{10}$/.test(value);
            },
            message: 'Contact number must be a valid number of 10 digits .',
        },


    },
    adress: {
        type: String,
    },
    label: {
  type: String,
  default: null,
  validate: {
    validator: function (value) {
      if (!value) return true; 
      const allowedLabels = ['Work', 'Friend', 'Family'];
      return allowedLabels.includes(value);
    },
    message: (props) =>
      `${props.value} is not a valid label. Allowed values are Work, Friend, Family.`,
  },
},

    image: {
        type: String,
    },
      bookmark:
       {
         type: Boolean, 
         default: false 
        },
})

phonebookSchema.post('save', (error, doci, next) => {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        next(new Error(messages.join(', ')));
    }
    
    else {
        next(error);
    }
});

const phonebookUser = mongoose.model('Phonebook', phonebookSchema)
export default phonebookUser;
