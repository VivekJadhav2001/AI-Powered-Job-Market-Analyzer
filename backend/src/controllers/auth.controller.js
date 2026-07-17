import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const register = async (req, res, next) => {
  try {
    const {
      userName,
      email,
      password,
      phoneNumber,
      role,
      resumeUrl,
      batch,
      leetcode,
      linkedIn,
    } = req.body;

    if (!userName || !email || !password ) {
      return res.error(400, "Please provide all required fields");
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.error(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      resumeUrl,
      batch,
      leetcode,
      linkedIn,
    });

    return res.success(201, "User registered successfully", user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.error(400, "Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.error(404, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.error(400, "Invalid password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.EXPIRE_TOKEN,
      }
    );

    res.cookie("AI_POWERED_JOB_MARKET", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export {
    register,
    login
}