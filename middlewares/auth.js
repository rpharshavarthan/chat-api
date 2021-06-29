const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    console.log(req.cookies.accesstoken);
    const token = req.cookies.accesstoken;
    if (!token)
      return res.status(400).json({ message: "please login or register" });
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
      if (err) {
        res.status(400).json({ message: "please login or register" });
      }
      console.log(verified);
      req.user = verified.id;
      next();
    });
  } catch (error) {
    console.log("auth error");
    res.status(500).json({ message: error.message });
  }
};

module.exports = auth;
