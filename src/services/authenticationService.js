const { default: mongoose } = require("mongoose");
const { errorResponses, ERRORS } = require("../errors");
const { Users, Sessions } = require("../models");
const { JWT } = require("../utils");

async function loginEndpoint(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const { email, password } = req.body;

    const user = await Users.findOne({
      email,
      password: JWT.encode(password),
    });
    if (!user) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    await Sessions.findOneAndDelete({
      user: mongoose.Types.ObjectId(user._id),
    });

    const sessionId = JWT.encode(
      { email, id: user._id },
      process.env.ACCESS_SECRET
    );

    const session = new Sessions({
      user: mongoose.Types.ObjectId(user._id),
      sessionId,
    });
    await session.save();

    res.status(200).send(
      JSON.stringify({
        accessToken: sessionId,
        username: user.username,
        hash: user.hash,
        status: user.status,
        microphone: user.microphone,
        headphones: user.headphones,
        avatar: user.avatar || null,
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

  const hash = Math.floor(Math.random() * 1000);

  const user = new Users({
    email,
    username,
    password: JWT.encode(password),
    birthDate: new Date(birthDate),
    acceptNotifications,
    status: "ONLINE",
    hash,
    microphone: true,
    headphones: true,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      username
    )}&size=64`,
  });
  await user.save();

  const sessionId = JWT.encode(
    { email, id: user.insertedId },
    process.env.ACCESS_SECRET
  );

  const session = new Sessions({
    user: user._id,
    sessionId: sessionId,
    createdAt: new Date(),
  });
  await session.save();

  res.status(200).send(
    JSON.stringify({
      accessToken: sessionId,
      email,
      username,
      birthDate,
      acceptNotifications,
      status: "ONLINE",
      hash,
      microphone: true,
      headphones: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&size=64`,
    })
  );
}

module.exports = {
  login: loginEndpoint,
  register: registerEndpoint,
};
