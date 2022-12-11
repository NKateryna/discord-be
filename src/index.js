const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { mongoConnectionString } = require("./constants");
const { applyREST, usersRoutes, authenticationRoutes } = require("./rest");
const { channelsRoutes } = require("./rest");
const { configureEnv } = require("./utils");

async function start() {
  try {
    configureEnv();
    const app = express();
    const PORT = 80;
    const applyRESTroutes = applyREST.bind(app);
    app.use(bodyParser.json());

    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoConnectionString(process.env.MONGO_PASS));
    applyRESTroutes(channelsRoutes, usersRoutes, authenticationRoutes);

    app.listen(PORT, (error) => {
      if (!error)
        console.log(
          "Server is Successfully Running, and App is listening on port " + PORT
        );
      else console.error("Error occurred, server can't start", error);
    });
  } catch (e) {
    console.error("Error while starting the app:", e);
  }
}

start();
