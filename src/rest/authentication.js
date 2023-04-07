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
    /**
     * POST /auth/login
     * payload: { email: string, password: string }
     * response: {
     *   accessToken: string,
     *   username:    string,
     *   hash:        number,
     * }
     */
    `${API_URL}/login`,
    withValidations(
      authenticationService.login,
      emailValidation,
      loginPayloadValidation
    )
  );
  app.post(
    /**
     * POST /auth/register
     * payload: {
     *   email: string,
     *   username: string,
     *   birthDate: Date,
     *   acceptNotifications: boolean,
     *   password: string
     * }
     * response: {
     *   accessToken:          string,
     *   email:                string,
     *   username:             string,
     *   birthDate:            Date,
     *   acceptNotifications:  boolean,
     *   status:               string,
     *   hash:                 number,
     *   microphone: true,
     *   headphones: true,
     *   avatar: string,
     * }
     */
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
