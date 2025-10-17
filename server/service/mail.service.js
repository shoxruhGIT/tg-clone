const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const otpModel = require("../models/otp.model");
const BaseError = require("../errors/base.error");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(to) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    await otpModel.create({
      email: to,
      otp: hashedOtp,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `OTP for verification ${new Date().toLocaleString()}`,
      html: `<h1>OTP: ${otp}</h1>`,
    });
  }

  async verifyOtp(email, otp) {
    const otpData = await otpModel.findOne({ email });
    if (!otpData) throw BaseError.BadRequest("Otp email data not found");
    console.log(otpData);

    // const currentOtp = otpData.otp
    // console.log(currentOtp);

    if (!otpData.otp) throw BaseError.BadRequest("Current Otp not found");

    console.log(otpData.expiredAt < new Date());

    console.log(new Date());

    if (otpData.expiredAt < new Date()) {
      throw BaseError.BadRequest("Otp expired");
    }

    const isValid = await bcrypt.compare(otp.toString(), otpData.otp);
    if (!isValid) throw BaseError.BadRequest("Invalid otp entered");

    await otpModel.deleteMany({ email });
    return true;
  }
}

module.exports = new MailService();
