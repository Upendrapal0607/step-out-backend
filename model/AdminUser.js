const mongoose = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();
const adminuserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    pwd: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Number,
      required: true,
      trim: true,
      default: Math.random().toFixed(6) * 1000000,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
  { bufferTimeoutMS: 30000 }
);
adminuserSchema.index({ username: 1 });
adminuserSchema.index({ pwd: 1 });

adminuserSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const adminuser = this;
  if (adminuser.isModified("pwd")) {
    adminuser.pwd = await bcrypt.hash(adminuser.pwd, 9);
  }
  adminuser.userid = Math.random().toFixed(6) * 1000000;
  next();
});

adminuserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const adminuser = this;
  const token = jwt.sign({ _id: adminuser._id }, process.env.JWT_KEY);
  adminuser.token_last_used = new Date();
  await adminuser.save();
  return token;
};

adminuserSchema.statics.login = async (email, pwd) => {
  const adminuser = await AdminUser.findOne({ email })
    .maxTimeMS(30000)
    .allowDiskUse(true);
  if (!adminuser) {
    throw new Error("Invalid credentials.");
  }
  // if (!adminuser.is_active) {
  //   throw new Error("Your account has been deactivated.");
  // }
  const isPasswordMatch = await bcrypt.compare(pwd, adminuser.pwd);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials.");
  }
  return adminuser;
};

// adminuserSchema.statics.changepassword = async (username, oldpwd, newpwd) => {
//   var adminuser = await AdminUser.findOne({ username });
//   if (!adminuser) {
//     throw new Error("Invalid user.");
//   }
//   const isPasswordMatch = await bcrypt.compare(oldpwd, adminuser.pwd);
//   if (!isPasswordMatch) {
//     throw new Error("Invalid old password.");
//   } else {
//     adminuser = await AdminUser.findOneAndUpdate(
//       { username },
//       { pwd: await bcrypt.hash(newpwd, 9) },
//       { new: true }
//     );
//   }

//   return adminuser;
// };

// adminuserSchema.statics.resetpassword = async (username, newpwd) => {
//   var adminuser = await AdminUser.findOne({ username });
//   if (!adminuser) {
//     throw new Error("Invalid user.");
//   }

//   adminuser = await AdminUser.findOneAndUpdate(
//     { username },
//     { pwd: await bcrypt.hash(newpwd, 9) },
//     { new: true }
//   );
//   return adminuser;
// };

const AdminUser = mongoose.model("adminusers", adminuserSchema);

module.exports = AdminUser;
