import express, { response } from 'express';
const router = express.Router();
import multer from 'multer';
import Post from '../models/posts.js';
import path from 'path';
import {jwtAuth} from '../controllers/user.js';
import fs from 'fs';
import { deletePost, getPost, getPosts, getUserPost , getOnePostandAuthor, setPostComment} from '../controllers/posts.js';


let uniquefilename;
const storage = multer.diskStorage({
    destination: (req,file, callback)=> {
        callback(null, './public/images/')
    },
    filename: (req, file, callback)=> {
        uniquefilename = Date.now() + '_' + Math.round(Math.random() * 100000) + path.extname(file.originalname);
        callback(null, uniquefilename)
    }
})

const upload = multer({storage: storage})

router.post('/create-post', jwtAuth, upload.single('picture'), (req,res)=> {
    const {title, summary, content} = req.body;
    const {_id} = req.user;

    const newPost = new Post({
        authorid: _id,
        title: title,
        summary: summary,
        content : content,
        filename: uniquefilename
    }).save()
    .then(post=> {
        res.status(201).json(post)
    }).catch(err=> {
        console.log(err)
    })
        
        console.log(req.file)
})

router.put("/update/:id", jwtAuth, upload.single('picture'), async(req, res)=> {
        const {id} = req.params
        const {title, summary, content} = req.body
    if(req.file) {
        
        const post = await Post.findOne(({_id: id}));
        Post.updateOne({_id:id} , {
            $set: {
                title: title,
                summary: summary,
                filename: req.file.filename,
                content:content
            }
        }).then(response=> {
            const filepath = `./public/images/${post.filename}`
            fs.unlink(filepath, err=> {
                if(err) throw err;
                console.log("file deleted")
            })
            console.log("with file", response)
            res.status(200).json(response)
        }).catch(err=> {
            console.log(err)
            res.status(500).json(err)
        })
    }else{
        Post.updateOne({_id: id}, {
            $set: {
                title: title,
                summary: summary,
                content: content
            }
        }).then(response=> {
            console.log("without file", response)
            res.status(200).json(response)
        }).catch(err=> {
            console.log(err)
            res.status(500).json(response)
        })
    }

})

router.get('/get-post/:id', getPost);
router.get('/get-posts', getPosts);
router.delete('/delete/:id', jwtAuth, deletePost);
router.get('/:userId', jwtAuth, getUserPost);
router.get("/post-and-author/:id", getOnePostandAuthor);
router.post("/add-comment/:id", jwtAuth, setPostComment);
export default router;