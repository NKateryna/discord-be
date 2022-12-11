const jwt = require("jsonwebtoken");
const { ONLINE_STATUSES } = require("../constants");
const { ERRORS } = require("../errors");
const { emailValidation } = require("./email");
const { passwordValidation } = require("./password");

const authValidation = (req) => {
  const authorization = req.header("Authorization");
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return { success: false, error: ERRORS.NOT_AUTHORIZED };
  }

  let error = null;

  jwt.verify(token, process.env.ACCESS_SECRET, (err) => {
    if (err) {
      error = { success: false, error: ERRORS.NOT_AUTHORIZED };
    }
  });

  if (error) {
    return { success: false, error: ERRORS.NOT_AUTHORIZED };
  }
  return { success: true };
};

function loginPayloadValidation(req) {
  const { email, password } = req.body;
  if (!email || !password) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

function registerPayloadValidation(req) {
  const { email, username, password, birthDate } = req.body;
  if (!email || !password || !username || !birthDate) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }

  const emailValidationResult = emailValidation(req);
  if (!emailValidationResult.success) {
    return emailValidationResult;
  }

  const passwordValidationResult = passwordValidation(req);
  if (!passwordValidationResult.success) {
    return passwordValidationResult;
  }

  return { success: true };
}

function statusValidation(req) {
  const { status } = req.body;
  if (ONLINE_STATUSES.indexOf(status) === -1) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

module.exports = {
  authValidation,
  loginPayloadValidation,
  registerPayloadValidation,
  statusValidation,
};
