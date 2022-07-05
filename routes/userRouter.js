import userController from "../controllers/userController.js";
import express from "express";
const userRouter = express.Router()

userRouter.get('/get', userController.getUsers)

userRouter.post('/change', userController.changePassword)

userRouter.post('/register', userController.register)

userRouter.post('/login', userController.login)

export default userRouter