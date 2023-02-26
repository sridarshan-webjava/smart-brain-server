const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");

const { db } = require("../../face_recognition/init-db/init-postgres");
const { hashPassword } = require("../../helpers/password");
const { registerUser } = require("../services/register");
const { signInUser } = require("../services/signin");
const OperationError = require("../../ErrorClass/OperationError");
const ValidationError = require("../../ErrorClass/ValidationError");

router.post("/signin", (req, res) => {
  signInUser(req, res, db, bcrypt)
    .then(data => res.json(data))
    .catch(e => {
      let errorCode;
      if (e instanceof OperationError || e instanceof ValidationError) {
        errorCode = 400;
      } else {
        errorCode = 500;
      }
      res.status(errorCode).json(e.message);
    });
});

router.post("/register", (req, res) => {
  registerUser(req, res, db, hashPassword)
    .then(data => res.json(data))
    .catch(e => {
      let errorCode;
      if (e instanceof OperationError || e instanceof ValidationError) {
        errorCode = 400;
      } else {
        errorCode = 500;
      }
      res.status(errorCode).json(e.message);
    });
});

module.exports = router;
