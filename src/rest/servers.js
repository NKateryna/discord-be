const { serversService } = require("../services");
const {
  withValidations,
  authValidation,
  requiredValidation, requiredURLParamsValidation,
} = require("../validations");

const API_URL = "/servers";

const serversRoutes = (app) => {
  app.get(
      /**
       * GET /servers
       * Get the list of servers user currently joined
       * headers: {
       *     Authorization: Bearer <authToken>
       * }
       *
       * response: {
       *   data: Array<{
       *       _id: string,
       *       name: string,
       *       photo: string,
       *   }>,
       *   total: number
       * }
       */
      API_URL, withValidations(serversService.getServers, authValidation)
  );
  app.post(
    /**
     * POST /servers
     * Create new server. User will be added to the server automatically
     * headers: {
     *     Authorization: Bearer <authToken>
     * }
     *
     * body: {
     *  name: string
     * }
     *
     * response: {
     *   name: string,
     *   photo: string,
     * }
     */
    API_URL,
    withValidations(
      serversService.createServer,
      authValidation,
      requiredValidation("name")
    )
  );
  app.get(
    /**
     * GET /servers/explore
     * Get the list of servers user is not joined yet
     * headers: {
     *     Authorization: Bearer <authToken>
     * }
     *
     * response: {
     *   data: Array<{
     *       _id: string,
     *       name: string,
     *       photo: string,
     *   }>,
     *   total: number
     * }
     */
    `${API_URL}/explore`,
    withValidations(serversService.exploreServers, authValidation)
  );
  app.post(
      /**
       * POST /servers/:serverId
       * Join to the new server
       * headers: {
       *     Authorization: Bearer <authToken>
       * }
       *
       * parameters: {
       *     serverId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
      `${API_URL}/:serverId`,
      withValidations(serversService.joinServer, authValidation, requiredURLParamsValidation('serverId'))
  );
  app.delete(
      /**
       * DELETE /servers/:serverId
       * Leave the server
       * headers: {
       *     Authorization: Bearer <authToken>
       * }
       *
       * parameters: {
       *     serverId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
      `${API_URL}/:serverId`,
      withValidations(serversService.leaveServer, authValidation, requiredURLParamsValidation('serverId'))
  );
};

module.exports = {
  serversRoutes,
};
