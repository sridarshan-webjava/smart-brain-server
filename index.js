const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const morgan = require("morgan");

const faceRecognitionController = require("./src/application/face_recognition/controller/FaceRecognitionController");
const profileController = require("./src/application/authentication/controller/ProfileController");
const authenticationController = require("./src/application/authentication/controller/AuthenticationController");

const app = express();

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/authentication/user", authenticationController);
app.use("/face-recognition", faceRecognitionController);
app.use("/profile", profileController);

xapp.get("/", (req, res) => res.send("Server is healthy and running"));

app.listen(8000, () => {
  console.log("Listening on Port 8000");
});
