import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";  // dont forget to add this .js otherview app gonna crash 
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout', logout)

export default router


