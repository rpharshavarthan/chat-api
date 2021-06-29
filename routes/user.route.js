const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/auth", userController.checkAuth);

module.exports = router;
