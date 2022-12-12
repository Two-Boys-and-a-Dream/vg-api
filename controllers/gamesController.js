const reusableAxiosPost = require("../igdbHelper");

module.exports = {
  newGames: async (req, res) => {
    try {
      const { data } = await reusableAxiosPost();
      res.status(200);
      res.json(data);
    } catch (e) {
      console.log(e);
      res.status(400);
      res.end();
    }
  },
  upcomingGames: async (req, res) => {
    res.send("yup");
  },
  popularGames: async (req, res) => {
    res.send("yup");
  },
};
