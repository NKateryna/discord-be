const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { mongoConnectionString } = require("./constants");
const {
  applyREST,
  usersRoutes,
  authenticationRoutes,
  serversRoutes,
} = require("./rest");
const { configureEnv } = require("./utils");

async function start() {
  try {
    configureEnv();
    const app = express();
    const PORT = 80;
    const applyRESTroutes = applyREST.bind(app);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
      fileUpload({
        createParentPath: true,
      })
    );
    app.use(
      cors({
        origin: "*",
      })
    );

    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoConnectionString(process.env.MONGO_PASS));
    applyRESTroutes(serversRoutes, usersRoutes, authenticationRoutes);

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
