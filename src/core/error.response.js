'use strict'

const { ReasonPhrases, StatusCode } = require('../utils/httpStatusCode');

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConclictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode)
  }
}

module.exports = {
  ConclictRequestError,
  ForbiddenError,
  BadRequestError,
  AuthFailureError,
  NotFoundError
}