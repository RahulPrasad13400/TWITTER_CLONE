import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";  // dont forget to add this .js otherview app gonna crash 
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router()

router.get('/me', protectRoute, getMe)
router.post('/signup',signup)
router.post('/login',login)
router.post('/logout', logout)

export default router


