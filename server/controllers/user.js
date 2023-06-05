import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const secret = 'kjlkfijrlkejlsd'

export const registerUser = (req,res)=>{
    const {name, email, password} = req.body;
    console.log(req.body)
    return new Promise(async(resolve, reject)=> {
        const user = await User.findOne({email: email});
        console.log(user)
        if(!user) {
            const salt = await bcrypt.genSalt();
            const hashpassword = await bcrypt.hash(password,salt);
            const newUser = new User({
                name: name,
                email: email,
                password: hashpassword,
                approved: false,
            }).save()
            .then(user=> {
                const newuser = {_id: user._id, email:user.email}
                res.status(201).json(newuser) 
                
            })
            .catch(err=> {
                res.status(500).json(err);
            })
        }else{

            return res.status(401).json('Email alread exist')
        }
        
    })

}

export const loginUser = (req, res)=> {
    const {email, password} = req.body;
    console.log(req.body)
    return new Promise(async(resolve,reject)=> {
        User.findOne({email: email}).then(user=> {
            if(!user) return res.status(401).json("Email not exist ")

            bcrypt.compare(password, user.password).then(isTrue=> {
                if(isTrue) {
                    delete user.password
                    jwt.sign({_id: user._id,email: user.email},secret, { expiresIn: '3h'}, (err,decoded)=> {
                        if(err) throw err;
                        const newuser = {_id: user._id, email:user.email}
                        res.cookie('token', decoded).json(newuser)
                    })
                    
                }else {
                    res.status(401).json("Password is incorrect")
                }
            }).catch(err=> {
                console.log(err)
                res.status(500).json(err)
            })

        })
        .catch(err=> {
            console.log(err                       )
            res.status(500).json(err)
        })
    })
}

export const Auth = (req, res)=> {

    res.status(200).json(req.user)
}

export const jwtAuth = (req, res, next) => {
    if(req.cookies) {
        const {token} = req.cookies;
        if(!token) return res.status(401).json("Authentications failed,please login")

        jwt.verify(token, secret, (err,decoded)=> {
            if(err) return res.status(404).json(err)
            req.user = {_id: decoded._id, email:decoded.email};
            next()
        })
    }
}


export const userLogout = (req, res)=>{
    res.clearCookie('token')
    res.status(200).json("Logout success")
}

export const getOneUser = async(req, res)=> {
    try{
        const { userId } = req.params
        const user = await User.findOne({_id: userId})
        delete user.password;
        res.status(200).json(user)
    }catch(err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

export const getAllUser = async(req, res)=> {
    try{
        const { id } = req.params
        const users = await User.find({_id: id})
        const newusers = users.forEach(user=> {
            delete user.password
        })
        res.status(200).json(newusers)
    }catch(err) {
        res.status(500).json({error: err.message})
    }
}

export const addRemovefollower = async(req, res)=> {
    try{
        const {authorid} = req.body;
    const {_id} = req.user
    const author = await User.findOne({_id: authorid});
    const follower = await User.findOne({_id: _id});
    if(author.followers.includes(_id)){
        author.followers = author.followers.filter(id=> id !== _id)
        follower.following = follower.following.filter(id=> id !== authorid);
    }else{
        author.followers.push(_id);
        follower.following.push(authorid)
    }

    await author.save();
    await follower.save();

    res.status(200).json(author)
    }catch(err) {
        console.log(err)
        res.status(500).json({err: err.message})
    }

}

export const changePassword = async(req, res)=> {
    const {id} = req.params;
    console.log(req.body)
    const {current_password, new_password, confirm_newpassword } = req.body
    try{
        const user = await User.findOne({_id:id});
        const isTrue = await bcrypt.compare(current_password, user.password);

        if(!isTrue) return res.status(401).json("Current Password is incorrect");
        const salt = await bcrypt.genSalt();
        const newpassword = await bcrypt.hash(new_password, salt);

        user.password = newpassword;
        user.save();
        res.status(200).json(user)
    }catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
}
