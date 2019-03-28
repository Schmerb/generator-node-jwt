"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const passport = require("passport");

const usersController = require("controllers/usersController");
// const { router: fileRouter } = require("./fileRouter");

const router = express.Router();
const jsonParser = bodyParser.json();
const authenticate = require("services/authenticate").authenticate();

router
  .route("/")
  .post(jsonParser, usersController.createUser) // registers a new user
  .get(usersController.getAllUsers); // returns all users DANGEROUS

router
  .route("/me")
  .all(authenticate)
  .get(usersController.getUser); // gets currenct user from JWT
// .delete(usersController.deleteAccount); // removes user's account

// updates user's email/phone number
// router.put(
//   "/me/settings",
//   [jsonParser, authenticate],
//   usersController.updateUser
// );

// Updates user's base currency
// router.put(
//   "/me/base-currency",
//   [jsonParser, authenticate],
//   usersController.updateBaseCurrency
// );

// router.use(busboyBodyParser({ limit: '10mb' })); // required for gridFS file store

// Hanldes storage of avatar profile image uploads
// router.use("/me/avatar", fileRouter);
// router.get('/avatar/:imgId', fileRouter);

module.exports = { router };
