const mongoose = require("mongoose");
const config = require("./index");
const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("connected to db succesfully");
});
mongoose.connection.on("reconnected", () => {
  console.log("reconnected to db");
});
mongoose.connection.on("error", (error) => {
  console.log("error connecting to db", error);
  mongoose.disconnect();
});
mongoose.connection.on("disconnected", () => {
  console.log("disconnected from db");
});
