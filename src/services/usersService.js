function getMe(req, res) {}

async function statusEndpoint(req, res) {
  try {
    const { status } = req.body;

    const session = await mongoose.connection
      .useDb("auth")
      .collection("sessions")
      .findOne(
        {
          sessionId: "26fc4fbf-c464-4079-a8e9-7a51adea59e9",
        },
        { user: 1 }
      );
    const user = await mongoose.connection
      .useDb("auth")
      .collection("users")
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(session.user) },
        { $set: { status: status } }
      );

    res.status(200).send(JSON.stringify({ status }));
  } catch (error) {
    res.status(error.code || 400).send(JSON.stringify(error));
  }
}

module.exports = {
  getMe,
  status: statusEndpoint,
};
