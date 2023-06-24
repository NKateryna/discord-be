const { usersService } = require("../services");
const {
  withValidations,
  authValidation,
  statusValidation,
  friendsStatusValidation,
  addFriendValidation,
  friendIdValidation,
  conversationIdValidation,
} = require("../validations");

const API_URL = "/users";

const usersRoutes = (app) => {
  app.get(
      /**
       * GET /users/me
       * Obtain basic information about authorized user
       *
       * headers: {
       *     Authorization: Bearer <authToken>
       * }
       *
       * response: {
       *     accessToken: string,
       *     username: string,
       *     hash: number,
       *     status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"],
       *     microphone: boolean,
       *     headphones: boolean,
       *     avatar: string,
       *     createdAt: Date
       * }
       */
      `${API_URL}/me`, withValidations(usersService.getMe, authValidation)
  );
  app.post(
      /**
       * POST /users/status
       * Change the current authorized user status
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * body: {
       *     status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"]
       * }
       *
       * response: {
       *     status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"],
       *     hash: number,
       *     username: string,
       *     microphone: boolean,
       *     headphones: boolean,
       *     avatar: string
       * }
       */
    `${API_URL}/status`,
    withValidations(usersService.status, authValidation, statusValidation)
  );
  app.post(
      /**
       * POST /users/microphone
       * Switch microphone for the current authorized user
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * response: {
       *     status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"],
       *     hash: number,
       *     username: string,
       *     microphone: boolean,
       *     headphones: boolean,
       *     avatar: string
       * }
       */
    `${API_URL}/microphone`,
    withValidations(usersService.microphone, authValidation)
  );
  app.post(
      /**
       * POST /users/headphones
       * Switch headphones for the current authorized user
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * response: {
       *     status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"],
       *     hash: number,
       *     username: string,
       *     microphone: boolean,
       *     headphones: boolean,
       *     avatar: string
       * }
       */
    `${API_URL}/headphones`,
    withValidations(usersService.headphones, authValidation)
  );
  app.get(
      /**
       * GET /users/conversations
       * Get the list of conversations for the current authorized user
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * response: {
       *   data: Array<{
       *     _id: string,
       *     sender: {
       *       username: string,
       *       hash: number,
       *       status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"],
       *       avatar: string,
       *     },
       *   }>,
       *   total: number
       * }
       */
    `${API_URL}/conversations`,
    withValidations(usersService.getConversations, authValidation)
  );
  app.delete(
      /**
       * DELETE /users/conversations/:conversationId
       * Delete the conversation
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     conversationId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
    `${API_URL}/conversations/:conversationId`,
    withValidations(usersService.deleteConversation, authValidation, conversationIdValidation)
  );
  app.get(
      /**
       * GET /users/friends
       * Get a friends list for authorized user
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     status: Query, required
       * }
       *
       * response: {
       *    data: Array<{
       *        _id: string,
       *        username: string,
       *        status: enum["ONLINE", "OFFLINE", "AWAY", "BUSY"],
       *        hash: number,
       *        avatar: string
       *    }>,
       *    total: number
       * }
       */
    `${API_URL}/friends`,
    withValidations(
      usersService.getFriends,
      authValidation,
      friendsStatusValidation
    )
  );
  app.post(
      /**
       * POST /users/friends
       * Send an invitation to another user
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * body: {
       *     username: string
       *     hash: number
       * }
       *
       * response: N/A
       * successCode: 204
       */
    `${API_URL}/friends`,
    withValidations(usersService.addFriend, authValidation, addFriendValidation)
  );
  app.delete(
      /**
       * DELETE /users/friends/:friendId
       * Delete a friend
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     friendId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
    `${API_URL}/friends/:friendId`,
    withValidations(usersService.deleteFriend, authValidation, friendIdValidation)
  );
  app.post(
      /**
       * POST /users/friends/block/:friendId
       * Block a friend. Deletes user from friends and pending lists
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     friendId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
    `${API_URL}/friends/block/:friendId`,
    withValidations(usersService.blockUser, authValidation, friendIdValidation)
  );
  app.delete(
      /**
       * DELETE /users/friends/block/:friendId
       * Unblock a friend
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     friendId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
    `${API_URL}/friends/block/:friendId`,
    withValidations(usersService.unblockUser, authValidation, friendIdValidation)
  );
  app.post(
      /**
       * POST /users/friends/accept/:friendId
       * Accept a friend invitation
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     friendId: URL, required
       * }
       *
       * response: N/A
       * successCode: 200
       */
    `${API_URL}/friends/accept/:friendId`,
    withValidations(usersService.acceptFriend, authValidation, friendIdValidation)
  );
  app.delete(
      /**
       * DELETE /users/friends/accept/:friendId
       * Decline a friend invitation
       *
       * headers: {
       *     Authorization: Bearer <token>
       * }
       *
       * parameters: {
       *     friendId: URL, required
       * }
       *
       * response: N/A
       * successCode: 204
       */
    `${API_URL}/friends/accept/:friendId`,
    withValidations(usersService.denyFriend, authValidation, friendIdValidation)
  );

  app.post(
      `${API_URL}/conversations/mock`,
      withValidations(usersService.mockConversations, authValidation)
  );
};

module.exports = {
  usersRoutes,
};
