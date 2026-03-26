const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req,res)=>{
  try {
    const {username,password,role} = req.body;

    if(!username || !password || !role){
      return res.status(400).json({error: "Username, password, and role are required"});
    }

    const existing = await User.findOne({username});
    if(existing){
      return res.status(400).json({error: "Username already exists"});
    }

    const hashed = await bcrypt.hash(password,10);

    const user = await User.create({
      username,
      password: hashed,
      role
    });

    res.json({message: "User registered successfully", user});
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

exports.login = async (req,res)=>{
  try {
    const {username,password,role} = req.body;

    if(!username || !password || !role){
      return res.status(400).json({error: "Username, password, and role are required"});
    }

    const user = await User.findOne({username,role});

    if(!user)
      return res.status(400).json({error: "User not found"});

    if(!user.active)
      return res.status(400).json({error: "Account disabled"});

    const match = await bcrypt.compare(password,user.password);

    if(!match)
      return res.status(400).json({error: "Invalid credentials"});

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {id:user._id, role:user.role},
      process.env.JWT_SECRET
    );

    res.json({token,user});
  }catch(err){
    res.status(500).json({error: err.message});
  }
};