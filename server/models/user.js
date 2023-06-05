import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {type: String, min: 4},
    email: {type: String, required: true},
    password: {type: String, required: true},
    followers: {type: Array},
    following : {type: Array}
    
},{timestamps: true})

const User = mongoose.model('User', userSchema);

export default User;