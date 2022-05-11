const User = require("../db/models/User");
const httpCodes = require("../constants/httpCodes");
const ErrorResponse = require("../utils/errorResponse");
const { sendMail } = require("../services/emailService");
const bcrypt = require("bcrypt");
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(
        new ErrorResponse("Invalid Credentials", httpCodes.NOT_FOUND)
      );
    const matchPassword = user.matchPassword(password);
    if (!matchPassword)
      return next(
        new ErrorResponse("Password doesnt match", httpCodes.NOT_FOUND)
      );
    const token = user.signToken();
    res
      .status(httpCodes.OK)
      .json({ error: false, user: { ...user._doc, token } });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const user = new User({ ...req.body });
    const savedUser = await user.save();
    res.status(httpCodes.OK).json({ error: false, data: savedUser });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return next(
        new ErrorResponse("Invalid Credentials", httpCodes.NOT_FOUND)
      );
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocol}:/${req.headers.hostname}/passwordreset/${resetToken}`;
    const message = `
        <h1>You sent a password reset request</h1>
        <p>Click link to reset your password</p>
        <a href=${resetUrl} target="_blank">${resetUrl}</a>
      `;
    const { status } = await sendMail({
      email,
      subject: `Reset Password`,
      message,
    });
    if (status.error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(
        new ErrorResponse(
          `Email could not be send`,
          httpCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    res.status(200).json({ error: false, message: "Email Sent" });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  try {
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
      return next(
        new ErrorResponse("Invalid Reset Password Token", httpCodes.NOT_FOUND)
      );
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res
      .status(httpCodes.OK)
      .json({ error: false, message: "Password Changed" });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, forgotPassword,resetPassword };
