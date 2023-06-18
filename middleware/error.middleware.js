import ApiError from '../exceptions/api.error.js'

export default function (err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message })
  }
  res.status(500).json({
    header: 'Server exception',
    message: err?.message
  })
}
