import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    authorid :{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required : true},
    summary: {type: String, required : true},
    filename: {type: String, required : true},
    content: {type: String, required : true},
    comments: {type: Array}
},{timestamps: true});

const Post = mongoose.model("Post", postSchema);
export default Post;    