const { errorResponses } = require("../errors");
const {
  authValidation,
  loginPayloadValidation,
  statusValidation,
} = require("./auth");
const { emailValidation } = require("./email");

function withValidations(serviceFn, ...validations) {
  return (req, res) => {
    try {
      validations.forEach((validation) => {
        const result = validation(req);

        if (!result.success) {
          throw errorResponses[result.error];
        }
      });
      serviceFn(req, res);
    } catch (error) {
      res
        .status(error.code)
        .send(JSON.stringify({ code: error.code, message: error.message }));
    }
  };
}

module.exports = {
  withValidations,
  authValidation,
  emailValidation,
  loginPayloadValidation,
  statusValidation,
};
