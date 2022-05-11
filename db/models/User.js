const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {nanoid} = require("nanoid") 
const UserSchema = new Schema({
  username: {
    type: String,
    unique: [true, "User already exists"],
    required: [true, "Please provide a username"],
    minlength: 4,
    trim: true,
    maxlength: 20,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address.",
    ],
    required: [true, "Please provide a email"],
    unique: true,
    lowercase: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  const user = this;
  const SALT = 10;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    let crypt = await bcrypt.hash(user.password, SALT);
    user.password = crypt;
    return next();
  } catch (err) {
    return next(err);
  }
});
UserSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
};

UserSchema.methods.getResetPasswordToken = function(){
  const resetToken = nanoid(10)
  const SALT = 10
  this.resetPasswordToken = bcrypt.hashSync(resetToken,SALT)
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)
  return resetToken
}

UserSchema.methods.compareCryptResetToken = function(resetToken){
  const result = bcrypt.compareSync(resetToken,this.resetPasswordToken)
  return result
}

const User = model("User", UserSchema);

module.exports = User;
