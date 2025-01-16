import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import UserControllers from './controllers/User.js';
dotenv.config();
try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('connected database');
    })
} 
catch (error) {
    console.log(error);
}

const app = express();
app.use(cors());
app.post('/api/users/login',UserControllers.loginUser);






app.listen(8080, () => {
    console.log("server is running...")
})