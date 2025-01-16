import EdupressUserModel from "../models/user.js";
import dotenv from 'dotenv';
dotenv.config();
const UserControllers = {
    loginUser : async (req,res) => {
        const {email,password} = req.body;
        const user = await EdupressUserModel.find({email});
        if (!user) {
            res.status(400).send({
                message:"no user found"
            })
        } else {
            const ifValid = await bcrypt.compare(password,user.password);
            if (!ifValid) {
                res.status(400).send({
                    message:'Password is wrong '
                })
            };
            const token = jwt.sign(req.body,process.env.SECRET_KEY,{expiresIn:'1h'});
            res.cookie("token",token,{
                httpOnly:true
            });
            res.status(200).json({
                message: 'Login Successful',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                  
                },
            });
        }
        }
};
export default UserControllers;
