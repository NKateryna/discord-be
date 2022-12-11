function getChannels() {}
function subscribeToChannel() {}

function getChannelsEndpoint(req, res) {}
function postChannelsEndpoint(req, res) {}

module.exports = {
  getChannels: getChannelsEndpoint,
  createChannel: postChannelsEndpoint,
};
