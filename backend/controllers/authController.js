const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// signup controller
exports.signup = async(req,res) =>{
    const {name, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try{
        const user = await User.create({name,email,password:hashedPassword})
        res.json({message:"User created successfully"})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

// login controller
exports.login = async(req,res) =>{
    const { email, password} = req.body
    const user = await User.findOne({email})
   if(!user) return res.status(400).json({message:"User not found"})

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({message:"Incorrect password"})

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn : "1h"}) 
    res.json({token})   
}
