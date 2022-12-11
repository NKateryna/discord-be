const { channelsRoutes } = require("./channels");
const { usersRoutes } = require("./users");
const { authenticationRoutes } = require("./authentication");

function applyREST(...services) {
  services.forEach((service) => {
    service(this);
  });
}

module.exports = {
  applyREST,
  channelsRoutes,
  usersRoutes,
  authenticationRoutes,
};
