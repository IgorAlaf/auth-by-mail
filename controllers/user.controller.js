import userService from '../services/user.service.js'
class UserContoller {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await userService.registration(email, password)
      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await userService.login(email, password)
      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const user = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      console.log(refreshToken)
      const tokens = await userService.refresh(refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      res.json(tokens)
    } catch (e) {
      next(e)
    }
  }
  async activate(req, res, next) {
    const link = req.params.link
    const user = userService.activate(link)
    res.json(user)
    try {
    } catch (e) {
      next(e)
    }
  }
}

export default new UserContoller()
