const { default: mongoose } = require("mongoose");
const fetch = require("node-fetch");
const { Sessions, Servers } = require("../models");

async function getServers(req, res) {
  res.setHeader("Content-Type", "application/json");
  const authorization = req.header("Authorization");
  const token = authorization.split(" ")[1];

  const session = await Sessions.findOne({ sessionId: token });

  const { user } = session;

  const channels = await Servers.find({
    members: { $in: [mongoose.Types.ObjectId(user)] },
  });

  res.status(200).send(
    JSON.stringify({
      data: channels.map(({ _id, name, photo }) => ({ _id, name, photo })),
      total: channels.length,
    })
  );
}

async function createServer(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { name } = req.body;
  const response = await fetch(
    "https://api.unsplash.com/photos/random?query=cute+cats&client_id=fvalt3cvxdBMbL6LiqXfmXh4H_BOKqoeEra2HvIn-YA"
  );
  const data = await response.json();
  const photo = data.urls.thumb;

  const authorization = req.header("Authorization");
  const token = authorization.split(" ")[1];

  const session = await Sessions.findOne({ sessionId: token });

  const { user } = session;

  const server = new Servers({
    name,
    photo,
    members: [mongoose.Types.ObjectId(user)],
  });
  await server.save();

  res.status(200).send(
    JSON.stringify({
      id: server.insertedId,
      name,
      photo,
    })
  );
}

async function exploreServers(req, res) {
  res.setHeader("Content-Type", "application/json");
  const authorization = req.header("Authorization");
  const token = authorization.split(" ")[1];

  const session = await Sessions.findOne({ sessionId: token });

  const { user } = session;

  const channels = await Servers.find({
    members: { $nin: [mongoose.Types.ObjectId(user)] },
  });

  res.status(200).send(
    JSON.stringify({
      data: channels.map(({ _id, name, photo }) => ({ _id, name, photo })),
      total: channels.length,
    })
  );
}

async function joinServer(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const session = await Sessions.findOne({ sessionId: token });

    const { user } = session;

    const { serverId } = req.params;

    await Servers.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(serverId) },
        { $addToSet: { members: [{ _id: mongoose.Types.ObjectId(user) }] } }
    );

    res.status(204).send();
  } catch(error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function leaveServer(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const session = await Sessions.findOne({ sessionId: token });

    const { user } = session;

    const { serverId } = req.params;

    await Servers.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(serverId) },
        { $pullAll: { members: [{ _id: mongoose.Types.ObjectId(user) }] } }
    );

    res.status(204).send();
  } catch(error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

module.exports = {
  getServers,
  createServer,
  exploreServers,
  joinServer,
  leaveServer,
};
