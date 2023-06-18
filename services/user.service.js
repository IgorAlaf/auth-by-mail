import UserDto from '../dtos/user.dto.js'
import tokenService from './token.service.js'
import UserModel from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import ApiError from '../exceptions/api.error.js'
import { v4 } from 'uuid'
import MailService from './mail.service.js'
class UserService {
  async registration(email, password) {
    const dublicate = await UserModel.findOne({ email })
    if (dublicate) {
      throw ApiError.badRequest('User is already logged in')
    }
    const activationLink = v4()
    const hashPassword = await bcrypt.hash(password, 3)
    const user = new UserModel({
      email,
      password: hashPassword,
      activationLink
    })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens(userDto)
    await tokenService.saveToken(tokens.refreshToken, user._id)
    const mailSender = new MailService()
    await mailSender.sendMail(
      email,
      `${process.env.URL_SERVER}/api/activate/${activationLink}`
    )
    await user.save()
    return { userDto, ...tokens }
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.unAuthorization('User is not authorizated')
    }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      throw ApiError.validationError('Wrong password')
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens(userDto)
    await tokenService.saveToken(tokens.refreshToken, user._id)
    return { userDto, ...tokens }
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token.refreshToken
  }
  async activate(activationLink) {
    const user = await UserModel.findOne(activationLink)
    if (!user) {
      throw ApiError.badRequest('User is not exists')
    }
    user.isActivated = true
    await user.save()
    return user
  }
  async refresh(refreshToken) {
    const validateToken = tokenService.validateRefresh(refreshToken)
    if (!validateToken) {
      throw ApiError.validationError('Wrong refreshToken')
    }
    const token = await tokenService.findToken(refreshToken)
    if (!token) {
      throw ApiError.badRequest('Token is not founded')
    }
    const user = await UserModel.findOne({ _id: token.userId })
    if (!user) {
      throw ApiError.badRequest('User in not founded')
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens(userDto)
    await tokenService.saveToken(tokens.refreshToken, user._id)
    return { ...tokens }
  }
}

export default new UserService()
