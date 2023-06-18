export default class ApiError extends Error {
  errors
  status
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
  static validationError(message, errors) {
    return new ApiError(403, message, errors)
  }
  static unAuthorization(message, errors) {
    return new ApiError(401, message, errors)
  }
  static badRequest(message) {
    return new ApiError(400, message)
  }
}
