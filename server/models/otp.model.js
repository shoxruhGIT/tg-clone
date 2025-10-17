const { Schema, model } = require("mongoose");

const otpScheme = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiredAt: { type: Date },
});

module.exports = model("Otp", otpScheme);
