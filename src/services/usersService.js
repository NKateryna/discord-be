const { default: mongoose } = require("mongoose");
const { errorResponses, ERRORS } = require("../errors");
const {
  Sessions,
  Users,
  DMs,
  Friends,
  Blocked,
  Pending,
} = require("../models");
const { JWT } = require("../utils");

async function getMe(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const session = await Sessions.findOneAndDelete({
      sessionId: token,
    }).populate("user");

    if (!session) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    const sessionId = JWT.encode(
      { email: session.user.email, id: session.user._id },
      process.env.ACCESS_SECRET
    );

    const insertedSession = new Sessions({
      user: session.user._id,
      sessionId,
    });
    await insertedSession.save();

    res.status(200).send(
      JSON.stringify({
        accessToken: sessionId,
        username: session.user.username,
        hash: session.user.hash,
        status: session.user.status,
        microphone: session.user.microphone,
        headphones: session.user.headphones,
        avatar: session.user.avatar,
        createdAt: session.user.createdAt,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(error?.code || 400).send(JSON.stringify(error));
  }
}

async function status(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const { status } = req.body;

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    const user = await Users.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { $set: { status: status } }
    );

    if (!user) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    const { hash, username, microphone, headphones, avatar } = user;

    res.status(200).send(
      JSON.stringify({
        status,
        hash,
        username,
        microphone,
        headphones,
        avatar,
      })
    );
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function microphone(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    const user = await Users.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      [{ $set: { microphone: { $eq: [false, "$microphone"] } } }]
    );

    if (!user) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    const { status, hash, username, microphone, headphones, avatar } = user;

    res.status(200).send(
      JSON.stringify({
        status,
        hash,
        username,
        microphone: !microphone,
        headphones,
        avatar,
      })
    );
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function headphones(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    const user = await Users.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      [{ $set: { headphones: { $eq: [false, "$headphones"] } } }]
    );

    if (!user) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    const { status, hash, username, microphone, headphones, avatar } = user;

    res.status(200).send(
      JSON.stringify({
        status,
        hash,
        username,
        microphone,
        headphones: !headphones,
        avatar,
      })
    );
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function getConversations(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    const dms = await DMs.find({ receiver: mongoose.Types.ObjectId(id) })
      .sort({
        lastMessage: -1,
      })
      .populate("sender");

    res.status(200).send(
      JSON.stringify({
        data: dms.map(({ _id, sender }) => ({
          _id,
          sender: {
            username: sender.username,
            hash: sender.hash,
            status: sender.status,
            avatar: sender.avatar,
          },
        })),
        total: dms.length,
      })
    );
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function deleteConversation(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const { conversationId } = req.params;

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    const dm = await DMs.findOneAndDelete({
      receiver: mongoose.Types.ObjectId(id),
      _id: mongoose.Types.ObjectId(conversationId),
    });

    if (!dm) {
      throw errorResponses[ERRORS.NOT_FOUND];
    }

    res.status(204).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

const COLLECTIONS = {
  online: Friends,
  all: Friends,
  blocked: Blocked,
  pending: Pending,
};

async function getFriends(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const { status } = req.query;

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    const Collection = COLLECTIONS[status];
    let data;
    if (status === "online") {
      data = await Collection.findOne({
        user: mongoose.Types.ObjectId(id),
      }).populate(
        "friends",
        { status: 1, avatar: 1, username: 1, hash: 1 },
        Users,
        { status: { $ne: "OFFLINE" } }
      );
    } else {
      data = await Collection.findOne({
        user: mongoose.Types.ObjectId(id),
      }).populate(
        "friends",
        { status: 1, avatar: 1, username: 1, hash: 1 },
        Users
      );
    }

    res.status(200).send(JSON.stringify(data));
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function deleteFriend(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const { friendId } = req.params;

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);

    await Friends.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      { $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] } }
    );
    await Friends.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(friendId) },
      { $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(id) }] } }
    );

    res.status(204).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function addFriend(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);
    const { username, hash } = req.body;

    const user = await Users.findOne({ username: username, hash: hash });

    if (user === null) {
      throw errorResponses[ERRORS.USER_NOT_FOUND];
    }

    let pending = await Pending.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(user._id) },
      { $addToSet: { friends: mongoose.Types.ObjectId(id) } }
    );

    if (pending === null) {
      pending = new Pending({
        user: mongoose.Types.ObjectId(user._id),
        friends: [mongoose.Types.ObjectId(id)],
      });
      await pending.save();
    }

    res.status(204).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function acceptFriend(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);
    const { friendId } = req.params;

    await Pending.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      { $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] } }
    );

    let friend = await Friends.findOneAndUpdate(
      {
        user: mongoose.Types.ObjectId(id),
      },
      { $addToSet: { friends: mongoose.Types.ObjectId(friendId) } }
    );

    if (friend === null) {
      friend = new Friends({
        user: mongoose.Types.ObjectId(id),
        friends: [mongoose.Types.ObjectId(friendId)],
      });
      await friend.save();
    }

    friend = await Friends.findOneAndUpdate(
      {
        user: mongoose.Types.ObjectId(friendId),
      },
      { $addToSet: { friends: mongoose.Types.ObjectId(id) } }
    );

    if (friend === null) {
      friend = new Friends({
        user: mongoose.Types.ObjectId(friendId),
        friends: [mongoose.Types.ObjectId(id)],
      });
      await friend.save();
    }

    res.status(200).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function denyFriend(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);
    const { friendId } = req.params;

    await Pending.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      { $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] } }
    );

    res.status(204).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function blockUser(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);
    const { friendId } = req.params;

    let blocked = await Blocked.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      { $addToSet: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] } }
    );

    if (!blocked) {
      blocked = new Blocked({
        user: mongoose.Types.ObjectId(id),
        friends: [mongoose.Types.ObjectId(friendId)],
      });

      await blocked.save();
    }

    await Friends.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      { $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] } }
    );

    await Pending.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      {
        $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] },
      }
    );

    res.status(204).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

async function unblockUser(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");

    const authorization = req.header("Authorization");
    const token = authorization.split(" ")[1];

    const { id } = JWT.decode(token, process.env.ACCESS_SECRET);
    const { friendId } = req.params;

    let blocked = await Blocked.findOneAndUpdate(
      { user: mongoose.Types.ObjectId(id) },
      { $pullAll: { friends: [{ _id: mongoose.Types.ObjectId(friendId) }] } }
    );

    res.status(204).send();
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

module.exports = {
  getMe,
  status,
  microphone,
  headphones,
  getConversations,
  deleteConversation,
  getFriends,
  deleteFriend,
  addFriend,
  blockUser,
  unblockUser,
  acceptFriend,
  denyFriend,
};
