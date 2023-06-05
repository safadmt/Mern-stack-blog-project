import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './Routes/user.js';
import postRouter from './Routes/posts.js';
import path , {dirname} from 'path';
import { fileURLToPath } from 'url';

const currentFilePath = fileURLToPath(import.meta.url)
const __dirname = dirname(currentFilePath)

const app = express();


app.use(express.static(path.join(__dirname + '/public')));

app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const db = 'mongodb+srv://safadmt:QwJPwnC8sPH5WGVc@cluster0.9ekwixw.mongodb.net/mernblogapp?retryWrites=true&w=majority'

mongoose.connect(db)
.then(()=> {
    console.log("Database connected")
})
.catch(err=>{
    console.log(err);
})

app.use('/user', userRouter);
app.use('/posts', postRouter);

const PORT = 4000 || process.env.PORT;
app.listen(PORT, err => err ? console.log : console.log(`Server connected to ${PORT}`));