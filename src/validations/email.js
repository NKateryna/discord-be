const { ERRORS } = require("../errors");

const emailValidation = (req) => {
  const { email } = req.body;

  const test = new RegExp(
    /^[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gm
  ).test(email);

  if (!test) {
    return { success: false, error: ERRORS.EMAIL_INVALID };
  }
  return { success: true };
};

module.exports = { emailValidation };
