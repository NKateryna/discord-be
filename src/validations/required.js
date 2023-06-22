const { ERRORS } = require("../errors");

const requiredValidation = (...keys) => {
  return (req) => {
    if (keys.some((key) => Object.keys(req.body).indexOf(key) === -1)) {
      return { success: false, error: ERRORS.INVALID_PAYLOAD };
    }
    return { success: true };
  };
};

const requiredURLParamsValidation = (...keys) => {
  return (req) => {
    if(keys.some((key) => Object.keys(req.params).indexOf(key) === -1))  {
      return { success: false, error: ERRORS.INVALID_PAYLOAD };
    }
    return { success: true };
  };
};

module.exports = { requiredValidation, requiredURLParamsValidation };
