import { Router } from 'express'
import userContoller from '../controllers/user.controller.js'
const userRouter = new Router()

userRouter.post('/registration', userContoller.registration)
userRouter.post('/login', userContoller.login)
userRouter.post('/logout', userContoller.logout)
userRouter.post('/refresh', userContoller.refresh)
userRouter.post('/activate/:link', userContoller.activate)

export default userRouter
