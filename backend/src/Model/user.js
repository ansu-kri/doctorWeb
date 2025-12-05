const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{ type: String, require: true},
    email:{ type: String, require: true, unique: true},
    password:{ type: String, require: true},
      areYou: { 
        type: String, 
        required: true,
        enum: ["patient", "doctor"] 
    },

    gender: { 
        type: String, 
        required: true,
        enum: ["male", "female"]
    },
})

module.exports = mongoose.model("User", userSchema)