import express from 'express'
import { checkEmail, signUpUser } from '../Controllers/SignUpController.js';
import { SignInGoogle, signInUser } from '../Controllers/SignInController.js';
import { SignInGoogle } from '../Controllers/SignInController.js';
const userRouters = express.Router();

userRouters.post('/signUpUser',checkEmail,signUpUser);
userRouters.post('/signInUser',signInUser);
userRouters.post('/signInGoogle',SignInGoogle)

export default userRouters;
