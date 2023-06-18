import jwt from 'jsonwebtoken'
import TokenModel from '../models/TokenModel.js'
class TokenService {
  generateTokens(userData) {
    console.log(userData)
    const accessToken = jwt.sign({ userData }, process.env.SECRET_ACCESS_JWT, {
      expiresIn: '15m'
    })
    const refreshToken = jwt.sign(
      { userData },
      process.env.SECRET_REFRESH_JWT,
      {
        expiresIn: '30d'
      }
    )
    return { accessToken, refreshToken }
  }
  async saveToken(refreshToken, userId) {
    const tokenData = await TokenModel.findOne({ userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      await tokenData.save()
    } else {
      await TokenModel.create({ refreshToken, userId })
    }
  }
  async removeToken(refreshToken) {
    const token = await TokenModel.findOneAndDelete({ refreshToken })
    return token
  }
  async findToken(refreshToken) {
    const token = await TokenModel.findOne({ refreshToken })
    return token
  }
  validateRefresh(refreshToken) {
    const validate = jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT)
    return validate
  }
}

export default new TokenService()
