import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"
import Notification from "../models/notification.modal.js"
import User from "../models/user.modal.js "

export const getUserProfile = async (req, res) =>{
    const {username} = req.params
     try{
        const user = await User.findOne({username}).select("-password")
        if(!user){
            return res.status(404).json({
                error : "User not found!"
            })
        }
        
        res.status(200).json(user)
     }catch(error){
        res.status(500).json({
            error : error.message
        })
        console.log("Error in getUserProfile", error.message)
     }
}

export const followUnfollowUser = async (req, res) =>{
    try{
        const {id} = req.params
        const userToModify = await User.findById(id).select("-password")
        const currentUser = await User.findById(req.user._id)
        // Checking whether the user is trying to follow or unfollow himself 
        if(id === req.user._id.toString()){
            return res.status(400).json({
                error : "You can't follow or unfollow yourself"
            })
        }
        if(!userToModify || !currentUser){
            return res.status(400).json({
                error : "User not found"
            })
        }
        // To check whether aleady following or not 
        const isFollowing = currentUser.following.includes(id)
        if(isFollowing){
            // if already following then on clicking the button it should unfollow the user 
            // Unfollow the user (in simple terms)
            await User.findByIdAndUpdate(id, {$pull : {followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull : {following : id}})
            res.status(200).json({
                message : "User unfollowed Successfully"
            })
        }else{
            // Follow the user 
            await User.findByIdAndUpdate(id, {$push : {followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push : {following : id}})

            // send notification to that user 
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to : userToModify._id
            })

            await newNotification.save()

            res.status(200).json({
                message : "User followed Successfully"
            })
        }
    }catch(error){
        res.status(500).json({
            error : error.message
        })
        console.log("Error in followUnfollowUser", error.message)
    }
}

export const getSuggestedUsers = async (req, res) =>{
    try{
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("following")
       
        const users = await User.aggregate([
            {
                $match : {
                    _id  : {$ne : userId}
                }
            },
            {
                $sample : {
                    size : 10
                }
            }
        ])

        const filteredUsers = users.filter(user=> !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user=>user.password=null)
        res.status(200).json(suggestedUsers)

    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}

export const updateUser = async (req, res) =>{

    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body
    let { profileImg, coverImg } = req.body
    const userId = req.user._id

    try{
        let user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                message : "user not found"
            })
        }
        if((!currentPassword && newPassword) || (currentPassword && !newPassword)){
            return res.status(400).json({
                error : "Please provide both current and new Password!"
            })
        }
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch){ 
                return res.status(400).json({
                    error : "current password is incorrect!"
                })
            }
            if(newPassword.length < 6){
                return res.status(400).json({
                    error : "Password must be atleast 6 character long!"
                })
            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        // to upload the image to cloudinary 
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url
        }

        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url
        }

        user.fullName = fullName || user.fullName
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        // update the database 
        user = await user.save()

        // password should be null on the response 
        user.password = null 
        res.status(200).json(user)

    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}