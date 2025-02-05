import Notification from "../models/notification.modal.js"

export const getNotifications = async (req, res) =>{
    try{
        const userId = req.user._id
        const notification = await Notification.find({to : userId}).populate({
            path : "from",
            select : "username profileImg"
        })
        await Notification.updateMany({to : userId}, {read : true})
        res.status(200).json(notification)
    
    }catch(error){
        res.status(500).json({
            error : error.message 
        })
    }
}

export const deleteNotifications = async (req, res) =>{
    try{
        const userId = req.user._id
        console.log(userId)
        await Notification.deleteMany({to : userId})
        
        res.status(200).json({
            message : "Notification deleted successfully!"
        })

    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}

export const deleteNotification = async (req, res) =>{
    try{

        const notificationId = req.params.id
        const userId = req.user._id
        
        const notification = await Notification.findById(notificationId)
        if(!notification){
            return res.status(400).json({
                error : "Notification not found!"
            })
        }

        if(notification.to.toString() !== userId.toString()){
            return res.status(400).json({
                error : "You cannot delete this notification!"
            })
        }
        
        await Notification.findByIdAndDelete(notificationId)
        
        res.status(200).json({
            message : "Notification deleted successfully"
        })

    }catch(err){
        res.status(500).json({
            error : error.message
        })
    }
}