const jwt = require("jsonwebtoken");
const AdminUser = require("../model/AdminUser");
require("dotenv").config();
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    console.log({ token });
    const data = jwt.verify(token, process.env.JWT_KEY);
    console.log({ data });
    const adminuser = await AdminUser.findOne({
      _id: data._id,
    });
    if (!adminuser) {
      throw new Error();
    }
    if (adminuser?.role !== "admin") {
      res.status(401).send({ error: "Not authorized to access this resource" });
    } else {
      req.adminuser = adminuser;
      req.token = token;
      next();
    }
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;
