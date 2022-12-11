const { channelsService } = require("../services");
const { withValidations, authValidation } = require("../validations");

const API_URL = "/channels";

const channelsRoutes = (app) => {
  app.get(
    API_URL,
    withValidations(channelsService.getChannels, authValidation)
  );
  app.post(
    API_URL,
    withValidations(channelsService.createChannel, authValidation)
  );
};

module.exports = {
  channelsRoutes,
};
