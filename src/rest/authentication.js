const { authenticationService } = require("../services");
const {
  withValidations,
  emailValidation,
  loginPayloadValidation,
} = require("../validations");
const { registerPayloadValidation } = require("../validations/auth");

const API_URL = "/auth";

const authenticationRoutes = (app) => {
  app.post(
    `${API_URL}/login`,
    withValidations(
      authenticationService.login,
      emailValidation,
      loginPayloadValidation
    )
  );
  app.post(
    `${API_URL}/register`,
    withValidations(
      authenticationService.register,
      emailValidation,
      registerPayloadValidation
    )
  );
};

module.exports = {
  authenticationRoutes,
};
