const Users = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { firstname, lastname, phone, email, password, confirmpassword } =
        req.body;
      if (
        !firstname ||
        !lastname ||
        !phone ||
        !email ||
        !password ||
        !confirmpassword
      ) {
        return res.status(400).json({ message: "fill all the field" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "password must be atleast 6 characters" });
      }
      if (password !== confirmpassword) {
        return res.status(400).json({ message: "passwords not matching" });
      }
      //check if user exists
      const user = await Users.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: "an account with this email already exists" });
      }

      const newUser = new Users({
        firstname,
        lastname,
        phone,
        email,
        password,
      });

      //hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          //save user
          newUser
            .save()
            .then(() => {
              console.log("user registered successfully");
            })
            .catch((error) => console.log(error));
        });
      });
      //auth token
      const accesstoken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET
        // { expiresIn: "7d" }
      );
      //cookie
      res.cookie("accesstoken", accesstoken, {
        httpOnly: true,
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.status(201).json({ message: "user registered successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "invalid credentials" });
      const ismatch = await bcrypt.compare(password, user.password);
      if (!ismatch)
        return res.status(400).json({ message: "invalid credentials" });
      //refresh token
      const accesstoken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
        // { expiresIn: "7d" }
      );
      //cookie
      res.cookie("accesstoken", accesstoken, {
        httpOnly: true,
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.status(201).json({ message: "login successfull" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("accesstoken");
      return res.status(200).json({ message: "logged out" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  checkAuth: async (req, res) => {
    try {
      const token = req.cookies.accesstoken;
      if (!token) return res.status(200).json({ verified: false });
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(200).json({ verified: false });
        }
        res.status(200).json({ user: user.id, verified: true });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {},
};

module.exports = userController;
