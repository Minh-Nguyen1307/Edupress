import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModels from "../Models/userModels.js";


export const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await UserModels.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Sign-in successful!",
      user: {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signInAdmin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required." });
      }
  
      const user = await UserModels.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        success: true,
        message: "Sign-in successful!",
        admin: {
          userId: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  };
export const SignInGoogle = async (req,res,next) => {
  const {email,googleId} = req.body;
  try {
    let user = await UserModels.find({email});
    if (!user) {
      res.status(400).send({
        message:"User not found"
      })
    }
    const token = generateToken(user._id);
    res.status(200).send({ success: true, token, user });
  } catch(error) {
    console.log(message.error);
  }
}