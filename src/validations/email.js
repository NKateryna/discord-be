const { ERRORS } = require("../errors");

const emailValidation = (req) => {
  const { email } = req.body;

  const test = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(email);

  if (!test) {
    return { success: false, error: ERRORS.EMAIL_INVALID };
  }
  return { success: true };
};

module.exports = { emailValidation };
