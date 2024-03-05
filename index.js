import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";

import { Userrouter } from "./routes/User.routes.js";


dotenv.config()

const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
    optionSuccessStatus: 200,
}))
app.use(cookieParser())
app.use('/auth',Userrouter)




async function connectToDatabase() {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URL);
  
      console.log('Connected to MongoDB successfully!');





      
      












      
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }


  connectToDatabase();

app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})
