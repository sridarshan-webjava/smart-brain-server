const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("Could not make API Call"));
};

const postImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(resp => {
      if (resp.length !== 0) {
        res.json(Number(resp[0]));
      } else {
        res.json("Not Found");
      }
    })
    .catch(err => console.log(err));
};

module.exports = {
  postImage,
  handleApiCall,
};
