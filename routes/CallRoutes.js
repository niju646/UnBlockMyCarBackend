const express = require("express");
const router = express.Router();
const callController = require("../controller/CallController.js");

router.post("/call", callController.makeCall);
router.post("/voice", callController.voiceResponse);
router.post("/end-call", callController.endCall);

module.exports = router;
