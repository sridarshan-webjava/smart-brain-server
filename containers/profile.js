const getUserProfile = (req, res, db) => {
  const { id } = req.params;
  db.select()
    .from("users")
    .where({ id })
    .then(resp => {
      if (resp.length !== 0) {
        res.json(resp[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.json("Try again later"));
};

module.exports = {
  getUserProfile,
};
