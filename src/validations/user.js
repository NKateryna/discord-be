function statusValidation(req) {
  const ONLINE_STATUSES = ["ONLINE", "OFFLINE", "AWAY", "BUSY"];
  const { status } = req.body;

  if (!status || ONLINE_STATUSES.indexOf(status) === -1) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

function friendsStatusValidation(req) {
  const STATUSES = ["all", "online", "blocked", "pending"];
  const { status } = req.query;

  if (!status || STATUSES.indexOf(status) === -1) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }

  return { success: true };
}

function addFriendValidation(req) {
  const { username, hash } = req.body;

  if (!username || !hash) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

function friendIdValidation(req) {
  const { friendId } = req.params;

  if (!friendId) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

function conversationIdValidation(req) {
  const { conversationId } = req.params;

  if (!conversationId) {
    return { success: false, error: ERRORS.INVALID_PAYLOAD };
  }
  return { success: true };
}

module.exports = {
  statusValidation,
  friendsStatusValidation,
  addFriendValidation,
  friendIdValidation,
  conversationIdValidation,
};
