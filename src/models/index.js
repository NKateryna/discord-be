const { Schema, default: mongoose } = require("mongoose");

const FriendsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { versionKey: false }
);

const BlockedSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { versionKey: false }
);

const FriendRequestssSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { versionKey: false }
);

const UsersSchema = new Schema(
  {
    email: String,
    username: String,
    password: String,
    birthDate: Date,
    acceptNotifications: Boolean,
    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "AWAY", "BUSY"],
    },
    hash: Number,
    headphones: Boolean,
    microphone: Boolean,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const DMsSchema = new Schema(
  {
    lastMessage: { type: Date, default: Date.now },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    receiver: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { versionKey: false }
);

const ServersSchema = new Schema(
  {
    name: String,
    photo: String,
    members: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { versionKey: false }
);

const SessionsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    sessionId: String,
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Users = mongoose.connection.model("users", UsersSchema);
const DMs = mongoose.connection.model("dms", DMsSchema);
const Sessions = mongoose.connection.model("sessions", SessionsSchema);
const Servers = mongoose.connection.model("servers", ServersSchema);
const Friends = mongoose.connection.model("friends", FriendsSchema);
const Blocked = mongoose.connection.model("blockeds", BlockedSchema);
const Pending = mongoose.connection.model("pendings", FriendRequestssSchema);

module.exports = {
  Users,
  DMs,
  Sessions,
  Servers,
  Friends,
  Blocked,
  Pending,
};
