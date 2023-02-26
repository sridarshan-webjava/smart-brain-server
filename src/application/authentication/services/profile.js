const getUserProfile = (req, res, db) => {
  const { id } = req.params;
  return db
    .select()
    .from("users")
    .where({ id })
    .then(resp => {
      if (resp.length !== 0) {
        return resp[0];
        // res.json(resp[0]);
      } else {
        throw new Error("Profile details not found");
        // res.status(400).json("Not found");
      }
    });
  // .catch(err => res.json("Try again later"));
};

module.exports = {
  getUserProfile,
};
