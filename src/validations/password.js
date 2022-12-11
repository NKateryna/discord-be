const { ERRORS } = require("../errors");

const passwordValidation = (req) => {
  const { password } = req.body;

  if (
    !new RegExp(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    ).test(password)
  ) {
    return { success: false, error: ERRORS.PASSWORD_INVALID };
  }
  return { success: true };
};

module.exports = { passwordValidation };
