import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.models.js';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import nodemailer from 'nodemailer'
import { Food_items } from '../models/Food_items.models.js';
import { Order } from '../models/Order.models.js'

dotenv.config()


const Userrouter = express.Router();

Userrouter.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const find = await User.findOne({ email }); // Assuming you want to find a user by email

    if (find) {
        return res.json({ message: "User already exists" });
    }

    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashpassword
        });

        await newUser.save();
        return res.json({ status:true,message: "User Registered" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


Userrouter.post('/login', async (req,res)=>{

    

    console.log("inside login Page");
    



    const {email,password}=req.body;
    console.log(email)
    console.log(password)
    const userfind=await User.findOne({ email });
    
    if(!userfind){
         console.log(userfind)
         return res.json({message:"The user is not valid"})
    }
    
    const validPassword=await bcrypt.compare(password,userfind.password)
    if(!validPassword){
        return res.json({message:"The entered password is wrong"})
    }
    
    const token = await jwt.sign({username:userfind.username,email:userfind.email},process.env.KEY,{});
    console.log(token)
    res.cookie('token', token, { sameSite: 'None', secure: true })
    console.log("inside login Page - cookie is set")
    const name=userfind.username;
    return res.json({status:true,message:"login success",namex:name});

})

Userrouter.get('/home', async (req, res) => {
  try {
    console.log("inside home page")
    const cards = await Food_items.find();
    console.log("cards are set")
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

Userrouter.post('/order', async (req, res) => {
    try {
      const email = req.body.user
      const item=req.body.item
      console.log(email)
      // console.log(item)
      //   // const order = new Order({
        //             user: email,
        //             items: [{ product:item }]
        //     });

        // await order.save();
        // res.json({message:"the data is stored"})

        const filter = { user: email };
        const update = { $push: { items: item} };
        const options = { new: true, upsert: true };
      
        const updatedOrder = await Order.findOneAndUpdate(filter, update, options).exec();
        res.json({message:"item is updated in the array"})



    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});





// Backend API to fetch data by email
Userrouter.post('/orders', async (req, res) => {
    try {
     
      const { user } = req.body;
      
      const orders = await Order.findOne({ user: user });
      // console.log(orders.items);
      const names=[{}]
      for(let i=0;i<orders.items.length;i++){
         const t=await Food_items.findOne({_id:orders.items[i]})
        
         const l={
            name:t.name,
            price:t.price
         }
         names.push(l);
      }
      // console.log(names)
      res.json({ names });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });



 

  const verifyUser = (req, res, next) => {
    try {
      console.log("inside verifyuser-- start");
      console.log(process.env.KEY);
     
      const token = req.cookies.token;
      
      console.log(token)
      if (!token) {
       
        return res.status(401).json({ status: false, message: "No token provided" });
      }
      jwt.verify(token, process.env.KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ status: false, message: "Unauthorized - Invalid token" });
        }
        // Optionally, you can attach the decoded token payload to the request object for later use
        
        next();
      });
    } catch (err) {
      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
  

  Userrouter.get("/verify",verifyUser,(req,res)=>{
    console.log("end point of verification");
    return res.json({status:true,message:"authorized"})
  })
  


export { Userrouter };
