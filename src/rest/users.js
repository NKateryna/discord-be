const { usersService } = require("../services");
const {
  withValidations,
  authValidation,
  statusValidation,
  friendsStatusValidation,
  addFriendValidation,
} = require("../validations");

const API_URL = "/users";

const usersRoutes = (app) => {
  app.get(`${API_URL}/me`, withValidations(usersService.getMe, authValidation));
  app.post(
    `${API_URL}/status`,
    withValidations(usersService.status, authValidation, statusValidation)
  );
  app.post(
    `${API_URL}/microphone`,
    withValidations(usersService.microphone, authValidation)
  );
  app.post(
    `${API_URL}/headphones`,
    withValidations(usersService.headphones, authValidation)
  );
  app.get(
    `${API_URL}/conversations`,
    withValidations(usersService.getConversations, authValidation)
  );
  app.delete(
    `${API_URL}/conversations/:conversationId`,
    withValidations(usersService.deleteConversation, authValidation)
  );
  app.get(
    `${API_URL}/friends`,
    withValidations(
      usersService.getFriends,
      authValidation,
      friendsStatusValidation
    )
  );
  app.post(
    `${API_URL}/friends`,
    withValidations(usersService.addFriend, authValidation, addFriendValidation)
  );
  app.delete(
    `${API_URL}/friends/:friendId`,
    withValidations(usersService.deleteFriend, authValidation)
  );
  app.post(
    `${API_URL}/friends/block/:friendId`,
    withValidations(usersService.blockUser, authValidation)
  );
  app.delete(
    `${API_URL}/friends/block/:friendId`,
    withValidations(usersService.unblockUser, authValidation)
  );
  app.post(
    `${API_URL}/friends/accept/:friendId`,
    withValidations(usersService.acceptFriend, authValidation)
  );
  app.delete(
    `${API_URL}/friends/accept/:friendId`,
    withValidations(usersService.denyFriend, authValidation)
  );
};

module.exports = {
  usersRoutes,
};
