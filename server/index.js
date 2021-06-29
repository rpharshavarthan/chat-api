require("dotenv").config()
const express = require("express");
const http = require("http");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("../middlewares/auth");
require("../config/mongo");
const WebSockets = require("../utils/webSockets");

//
const app = express();
const port = process.env.PORT || 3000;
app.set("port", port);

//
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("../routes/index.route"));
app.use("/users", require("../routes/user.route"));
app.use("/rooms", auth, require("../routes/chat.route"));
app.use("/delete", auth, require("../routes/delete.route"));

//catch 404
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

//create http server
const server = http.createServer(app);
// Create socket connection
global.io = require("socket.io")(server);
global.io.on('connection', WebSockets.connection)
server.listen(port, () => {
  console.log(`server is listening on port http://localhost:${port}/`);
});
