const env = require("dotenv");
const jwt = require("jsonwebtoken");

function configureEnv() {
  const environments = env.config();
  if (environments.error) {
    console.error(
      "Environment is not configured. Please refer to your .env file and ensure that propper information is present [ERRORS_ENV_NOT_CONFIGURED]."
    );
  }
}

const JWT = {
  encode: (data, secret = process.env.PASS_SECRET) => jwt.sign(data, secret),
  decode: (token, secret = process.env.PASS_SECRET) =>
    jwt.verify(token, secret),
};

module.exports = { configureEnv, JWT };
