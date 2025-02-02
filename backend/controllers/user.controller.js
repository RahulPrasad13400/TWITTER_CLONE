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
        console.log(user)
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
            await User.findByIdAndUpdate(req.user_id, {$pull : {following : id}})
            res.status(200).json({
                message : "User unfollowed Successfully"
            })
        }else{
            // Follow the user 
            await User.findByIdAndUpdate(id, {$push : {followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push : {following : id}})

            // send notification to that user 


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