const { serversRoutes } = require("./servers");
const { usersRoutes } = require("./users");
const { authenticationRoutes } = require("./authentication");

function applyREST(...services) {
  services.forEach((service) => {
    service(this);
  });
}

module.exports = {
  applyREST,
  serversRoutes,
  usersRoutes,
  authenticationRoutes,
};
