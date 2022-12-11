const { default: mongoose } = require("mongoose");
const uuid = require("uuid");
const { errorResponses, ERRORS } = require("../errors");
const { JWT } = require("../utils");

async function loginEndpoint(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const { email, password } = req.body;

    const usersCollection = mongoose.connection
      .useDb("auth")
      .collection("users");
    const sessionsCollection = mongoose.connection
      .useDb("auth")
      .collection("sessions");

    const user = await usersCollection.findOne({
      email,
      password: JWT.encode(password),
    });
    if (!user) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    await sessionsCollection.findOneAndDelete({
      user: mongoose.Types.ObjectId(user._id),
    });

    const sessionId = JWT.encode(
      { email, id: user._id },
      process.env.ACCESS_SECRET
    );

    await sessionsCollection.insertOne({
      user: mongoose.Types.ObjectId(user._id),
      sessionId,
      createdAt: new Date(),
    });

    res.status(200).send(
      JSON.stringify({
        accessToken: sessionId,
        username: user.username,
        hash: user.hash,
      })
    );
  } catch (error) {
    res.status(error.code).send(JSON.stringify(error));
  }
}
async function registerEndpoint(req, res) {
  res.setHeader("Content-Type", "application/json");
  const {
    email,
    username,
    password,
    birthDate,
    acceptNotifications = false,
  } = req.body;
  const usersCollection = mongoose.connection.useDb("auth").collection("users");
  const sessionsCollection = mongoose.connection
    .useDb("auth")
    .collection("sessions");

  const hash = Math.floor(Math.random() * 1000);

  const user = await usersCollection.insertOne({
    email,
    username,
    password: JWT.encode(password),
    birthDate: new Date(birthDate),
    acceptNotifications,
    status: "ONLINE",
    hash,
  });

  const sessionId = JWT.encode(
    { email, id: user.insertedId },
    process.env.ACCESS_SECRET
  );

  await sessionsCollection.insertOne({
    user: user.insertedId,
    sessionId: sessionId,
    createdAt: new Date(),
  });

  res.status(200).send(
    JSON.stringify({
      accessToken: sessionId,
      email,
      username,
      birthDate,
      acceptNotifications,
      status: "ONLINE",
      hash,
    })
  );
}

module.exports = {
  login: loginEndpoint,
  register: registerEndpoint,
};
