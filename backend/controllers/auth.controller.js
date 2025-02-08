import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.modal.js";     // .js must ayitt idanam 
import bcrypt from "bcryptjs" // To hash the password 

export const signup = async (req,res)=>{
    try{
        const {fullName, username, email, password} = req.body
        if(!fullName || !username || !email || !password){
            return res.status(400).json({
                error: "Fill out all the fields!"
              });
        }
        // To verify email 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            error: "Invalid email format"
          });
        }
        // To check whether the username already exist 
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({
                error : "Username is already taken"
            })
        }
        // To check whether the email already exist 
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({
                error : "Email is already taken"
            })
        }
        // To check the length of the password 
        if(password.length<6){
            return res.status(400).json({
                error : "Password must be longer than 6 letters"
            })
        }
        // Hash password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName, 
            username, 
            email,
            password : hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            return res.status(201).json({
                id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                username : newUser.username,
                followers : newUser.followers,
                following  : newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newUser.coverImg
            })
        }else{
            return res.status(200).json({
                error : "invalid user data"
            })
        }

    }catch(error){
        return res.status(500).json({
            error : error.message
        })
    }
}

export const login = async (req, res)=>{
    try{
        const {username, password} = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect){
            return res.status(400).json({
                error : "invalid username or password"
            })
        }
        generateTokenAndSetCookie(user._id, res)
        return res.status(200).json({
            id : user._id,
            fullName : user.fullName,
            email : user.email,
            username : user.username,
            followers : user.followers,
            following  : user.following,
            profileImg : user.profileImg,
            coverImg : user.coverImg
        })

    }catch(error){
        return res.status(500).json({
            error : error.message
        })
    }
}
export const logout = async (req, res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            message : "logged out successfully"
        })
    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}

export const getMe = async (req, res) =>{
    console.log("mier")
    try{
        const user = await User.findById(req.user._id).select("-password")
        console.log("user : ", user)
        if(!user){
            res.status(401).json({
                error : "please login to continue"
            })
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}