const { serversService } = require("../services");
const {
  withValidations,
  authValidation,
  requiredValidation,
} = require("../validations");

const API_URL = "/servers";

const serversRoutes = (app) => {
  app.get(API_URL, withValidations(serversService.getServers, authValidation));
  app.post(
    API_URL,
    withValidations(
      serversService.createServer,
      authValidation,
      requiredValidation("name")
    )
  );
};

module.exports = {
  serversRoutes,
};
