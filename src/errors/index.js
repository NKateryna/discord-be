const ERRORS = {
  NOT_AUTHORIZED: "user-not-authorized",
  UNAUTHORIZED: "unauthorized",
  INVALID_PAYLOAD: "invalid-payload",
  USER_NOT_FOUND: "user-not-found",
  EMAIL_INVALID: "email-is-not-valid",
  PASSWORD_INVALID: "password-is-not-valid",
};

const errorResponses = {
  [ERRORS.NOT_AUTHORIZED]: {
    code: 401,
    message: "User is not authorized",
  },
  [ERRORS.UNAUTHORIZED]: {
    code: 403,
    message: "Unauthorized",
  },
  [ERRORS.INVALID_PAYLOAD]: {
    code: 400,
    message: "Invalid payload",
  },
  [ERRORS.USER_NOT_FOUND]: {
    code: 404,
    message: "User not found",
  },
  [ERRORS.EMAIL_INVALID]: {
    code: 400,
    message: "Email is not valid",
  },
  [ERRORS.PASSWORD_INVALID]: {
    code: 400,
    message:
      "Password should be minimum eight characters long and contain at least one letter, one number and one special character",
  },
};

module.exports = { errorResponses, ERRORS };
