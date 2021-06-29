const router = require("express").Router();
const user = require("../controllers/user.controller");
const {encode} = require("../middlewares/jwt.js");

router.post("/login/:userId", encode, (req, res, next) => {
  return res.status(200).json({
    success: true,
    authorization: req.authToken,
  });
});


module.exports = router;
