import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      required: true,
    },resumeUrl: {
      type: String,
      trim: true,
    },
    resumePublicId: {
      type: String,
      trim: true,
    },
    resumeText: {
      type: String,
    },
},{timestamps:true})


const User = mongoose.model("User",userSchema)