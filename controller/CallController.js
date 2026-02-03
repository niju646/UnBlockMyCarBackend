const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

exports.makeCall = async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const call = await client.calls.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: `${process.env.BASE_URL}/voice`,
    });

    res.json({
      success: true,
      callSid: call.sid,
      message: "Call initiated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.voiceResponse = (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  response.say(
    { voice: "alice" },
    "Hello! This is an anonymous call from our application.",
  );

  res.type("text/xml");
  res.send(response.toString());
};

//end call
exports.endCall = async (req, res) => {
  const { callSid } = req.body;

  if (!callSid) {
    return res.status(400).json({ error: "Call SID is required" });
  }

  try {
    const call = await client.calls(callSid).update({ status: "completed" });

    res.json({
      success: true,
      callSid: call.sid,
      message: "Call ended successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
