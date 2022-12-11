const { usersService } = require("../services");
const {
  withValidations,
  authValidation,
  statusValidation,
} = require("../validations");

const API_URL = "/users";

const usersRoutes = (app) => {
  app.get(`${API_URL}/me`, withValidations(usersService.getMe, authValidation));
  app.post(
    `${API_URL}/status`,
    withValidations(usersService.status, statusValidation)
  );
};

module.exports = {
  usersRoutes,
};
