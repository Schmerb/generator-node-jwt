import express from "express";
import bodyParser from "body-parser";

import usersController from "controllers/usersController";

export const router = express.Router();

const jsonParser = bodyParser.json();
const authenticate = require("services/authenticate").authenticate();

router
  .route("/")
  .post(jsonParser, usersController.createUser) // registers a new user
  .get(usersController.getAllUsers); // returns all users DANGEROUS

router
  .route("/me")
  .all(authenticate)
  .get(usersController.getUser) // gets currenct user from JWT
  .delete(usersController.deleteAccount); // removes user's account

export default router;
