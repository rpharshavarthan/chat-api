const router = require("express").Router();
const deleteController = require("../controllers/delete.controller");

router
  .delete("/room/:roomId", deleteController.deleteRoomById)
  .delete("/message/:messageId", deleteController.deleteMessageById);

module.exports = router;