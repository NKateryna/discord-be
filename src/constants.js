const mongoConnectionString = (pass) =>
  `mongodb+srv://be-admin:${pass}@discord-be.oejdbtw.mongodb.net/?retryWrites=true&w=majority`;

const ONLINE_STATUSES = ["ONLINE", "OFFLINE", "AWAY", "DONT_DISTURB"];

module.exports = {
  mongoConnectionString,
  ONLINE_STATUSES,
};
