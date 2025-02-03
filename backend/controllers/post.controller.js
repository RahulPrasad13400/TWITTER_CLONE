import User from "../models/user.modal.js"
import Post from "../models/post.modal.js"
import { v2 as cloudinary } from "cloudinary"

export const createPost = async (req,res) =>{
    try{
        const {text} = req.body 
        let {img} = req.body
        const userId = req.user._id.toString()
        const user = await User.findById(userId)
        if(!user) return res.status(400).json({message : "User not found!"})

        if(!text && !img){
            return res.status(400).json({
                error : "post must have a text or a image!"
            })
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user : userId,
            text,
            img
        })
        
        await newPost.save()
        res.status(201).json(newPost)

    }catch(error){
        res.status(500).json({
            error : error.message
        })
        console.log(error)
    }
}

export const deletePost = async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({
                error : "Post not found!"
            })
        }
        if(post.user.toString() !== req.user._id.toString()){
            res.status(401).json({
                error : "You are not authorized to delete this post!"
            })
        }
        if(post.img){
            const imgId = post.img.split('/').pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message : "post deleted successfully!"
        })
    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}

export const commentOnPost = async (req, res) =>{
    try{
        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id.toString()
         
        if(!text){
            return res.status(400).json({
                error : "Comment text is required!"
            })
        }
        
        const post = await Post.findById(postId)

        if(!post){
            res.status(404).json({
                error : "Post not found"
            })
        }

        const comment = {user : userId, text}

        post.comments.push(comment)
        await post.save()      
        
        res.status(200).json(post)

    }catch(error){
        res.status(404).json({
            error : error.message
        })
    }
}

export const likeUnlikePost = async (req, res) =>{
    try{
        const {id : postId} = req.params.id
        const post = await Post.findById(postId) 
        const userId = req.user._id

        if(!post){
            return res.status(404).json({
                error : "Post not found"
            })
        }

        const userLikedPost = post.likes.includes(userId)
        

    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}