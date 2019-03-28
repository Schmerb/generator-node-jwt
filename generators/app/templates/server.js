"use strict";

require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const cors = require("cors");
const busboyBodyParser = require("busboy-body-parser");

// CONFIG
mongoose.Promise = global.Promise;

const isProduction = process.env.NODE_ENV === "production";

const { basicStrategy, jwtStrategy } = require("auth/strategies");
const {
  PORT,
  DATABASE_URL,
  TEST_DATABASE_URL,
  CLIENT_ORIGIN
} = require("config");

// EXPRESS INSTANCE
const app = express();

// CRON jobs
// require("services/cron-jobs");

// SOCKET.IO
// const httpServer = require("http").Server(app);
// require("services/live-chat")(httpServer);

// LOGGING
app.use(morgan("common"));

// CORS
app.use(
  cors({
    origin: [
      // Whitelist
      CLIENT_ORIGIN,
      "http://localhost:3000"
    ]
  })
);

// MIDDLEWARE
app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

require("services/authenticate").init(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser({ limit: "10mb" })); // required for gridFS file store

// ROUTES
const { routes } = require("routes");
routes(app);

// Fallback for all non-valid endpoints
app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(
  databaseUrl = DATABASE_URL, // isProduction ? DATABASE_URL : TEST_DATABASE_URL,
  port = PORT
) {
  return new Promise((resolve, reject) => {
    console.log({ databaseUrl });
    mongoose.connect(databaseUrl, { useNewUrlParser: true }).then(
      () => {
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      },
      err => {
        return reject(err);
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer, passport };
