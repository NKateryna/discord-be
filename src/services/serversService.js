const { default: mongoose } = require("mongoose");
const fetch = require("node-fetch");

async function getServers(req, res) {
  const authorization = req.header("Authorization");
  const token = authorization.split(" ")[1];

  const session = await mongoose.connection
    .useDb("auth")
    .collection("sessions")
    .findOne({ sessionId: token });

  const { user } = session;

  const channels = await mongoose.connection
    .useDb("auth")
    .collection("servers")
    .find({ members: { $in: [mongoose.Types.ObjectId(user)] } })
    .toArray();

  res.status(200).send(
    JSON.stringify({
      data: channels,
      total: channels.length,
    })
  );
}

async function createServer(req, res) {
  const { name } = req.body;
  const response = await fetch(
    "https://api.unsplash.com/photos/random?query=cute+cats&client_id=fvalt3cvxdBMbL6LiqXfmXh4H_BOKqoeEra2HvIn-YA"
  );
  const data = await response.json();
  const photo = data.urls.thumb;

  const authorization = req.header("Authorization");
  const token = authorization.split(" ")[1];

  const session = await mongoose.connection
    .useDb("auth")
    .collection("sessions")
    .findOne({ sessionId: token });

  const { user } = session;
  const server = await mongoose.connection
    .useDb("auth")
    .collection("servers")
    .insertOne({
      name,
      photo,
      members: [mongoose.Types.ObjectId(user)],
    });

  res.status(200).send(
    JSON.stringify({
      id: server.insertedId,
      name,
      photo,
    })
  );
}

module.exports = {
  getServers,
  createServer,
  joinServer: null,
};
