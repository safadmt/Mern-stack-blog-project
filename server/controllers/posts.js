import multer from 'multer';
import Post from '../models/posts.js';
import path, { resolve } from 'path';
import fs from 'fs';


export const getPosts = (req, res)=> {
    return new Promise((resolve,reject)=> {
        Post.find().then(posts=> {
            res.status(200).json(posts)
        })
        .catch(err=> res.status(500).json(err));
    })
}

export const getPost = (req, res)=> {
    const {id} = req.params
    console.log(req.params)
    if(!req.params) 
    return res.status(400).json("id is undeifned")
    
    return new Promise((resolve,reject)=> {
        
        Post.findOne({_id: id}).then(post=> {
            res.status(200).json(post)
        })
        .catch(err=> res.status(500).json(err));
    })
}

export const deletePost = (req, res)=> {
    const {id} = req.params
    if(!req.params) return res.status(400).json("request params undefined")
    
    return new Promise(async(resolve,reject)=> {
        const post = await Post.findOne({_id: id});
        Post.deleteOne({_id: id}).then(post=> {
            res.status(200).json(post)
        })
        .catch(err=> {
            
            res.status(500).json(err)
        })
        if(post) {
            const filename = post.filename;
            const filepath = `./public/images/${filename}`
            fs.unlink(filepath, err=> {
                if(err) throw err;
                console.log("file deleted")
            })
        }
        
    })
}


export const getUserPost = (req,res) => {
    const {userId} = req.params;
    console.log(req.params);
    return new Promise((resolve, reject)=> {
        Post.find({authorid : userId}).then(response=> {
            res.status(200).json(response);
        }).catch(err=> {

            console.log(err);
            
        })
    })
}
export const getOnePostandAuthor = (req, res)=> {
    const {id} = req.params;
    return new Promise((resolve, reject)=> {
        Post.findOne({_id:id}).populate('authorid').then(response=> {
            res.status(200).json(response)
        }).catch(err=> {
            res.status(500).json(err)
        })
    })
}

export const setPostComment = (req, res) => {
    const {id} = req.params;
    console.log(id)
    const {email} = req.user;
    return new Promise((resolve, rejects)=> {
        Post.updateOne({_id : id}, {
            $set : {
                comments: {email: email, comment: req.body.comment}
            }
        }).then(response=> {
            console.log(response);
            res.status(200).json(response);
        }).catch(err=> {
            res.status(500).json(err);
        })
    })
}



