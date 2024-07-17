const express = require("express");
// const AdminUser = require("../models/AdminUser");
// const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const AdminUser = require("../model/AdminUser");

const router = express.Router();

router.post("/register", async (req, res) => {
  // Create a new user
  try {
    const { username, email, pwd, role } = req.body;
    console.log("admin user", email, username, pwd, role);
    // const employee = await Employee.findOne({ _id: employee_id });
    // console.log("employee", employee);
    const adminuser = new AdminUser({
      username,
      email,
      pwd,
      role,
    });
    await adminuser.save();
    const token = await adminuser.generateAuthToken();
    console.log("token", token);
    const response = { username: adminuser.username, token: token };
    // console.log("response", response);
    return res.send({
      status: 1,
      message: "User registered successfully.",
      data: response,
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      if (error.message.includes("username:")) {
        return res.send({
          status: 0,
          message: "Username already exists.",
          data: "",
        });
      } else {
        return res.send({
          status: 0,
          message: "User for selected employee already exists.",
          data: error,
        });
      }
    } else {
      return res.send({
        error,
        status: 0,
        message: "Something went wrong.",
        data: "",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const adminuser = await AdminUser.login(email, pwd);
    if (!adminuser) {
      return res.send({
        error: "Login failed! Check authentication credentials",
      });
    }
    const token = await adminuser.generateAuthToken();
    const response = {
      username: adminuser.username,
      email: adminuser.email,
      role: adminuser.role,
      userid: adminuser.userid,
      token: token,
    };
    return res.send({
      status: 1,
      message: "Login successful.",
      data: response,
    });
  } catch (error) {
    return res.send({ status: 0, message: error.message, data: "" });
  }
});

router.get("/get", auth, async (req, res) => {
  try {
    return res.send({
      status: 1,
      message: "Query executed successfully.",
      data: req.adminuser,
    });
  } catch (error) {
    return res.send({ status: 0, message: "Query execution error.", data: "" });
  }
});

// router.post("/getall", auth, async (req, res) => {
//   try {
//     if (req.adminuser.role !== "Owner" && req.adminuser.role!=="Admin" && req.adminuser.role!=="Manager"  ) {
//       return res.send({
//         status: 0,
//         message: "You are not authorized to access user details.",
//         data: "",
//       });
//     }
//     const adminusers = await AdminUser.find({
//       // role: { $ne: "Owner" },
//     }).sort({ createdAt: -1 });
//     if (!adminusers) {
//       return res.send({
//         status: 0,
//         message: "Query execution error.",
//         data: "",
//       });
//     }

//     let obj = [];

//     for (i = 0; i < adminusers.length; i++) {
//       let o = {
//         _id: adminusers[i]._id,
//         is_active: adminusers[i].is_active,
//         status: adminusers[i].is_active ? "Active" : "Inactive",
//         username: adminusers[i].username,
//         name: adminusers[i].name,
//         mobile: adminusers[i].mobile,
//         role: adminusers[i].role,
//         employee_details: adminusers[i].employee_details,

//         createdAt: adminusers[i].createdAt,
//         updatedAt: adminusers[i].updatedAt,
//       };
//       obj.push(o);
//     }

//     return res.send({
//       status: 1,
//       message: "Query executed successfully.",
//       data: obj,
//     });
//   } catch (error) {
//     return res.send({ status: 0, message: "Query execution error.", data: "" });
//   }
// });

// router.post("/getbyrole", auth, async (req, res) => {
//   try {
//     const { role } = req.body;
//     const adminuser = await AdminUser.aggregate([
//       { $match: { role } },
//       {
//         $project: {
//           username: 1,
//           name: 1,
//           mobile: 1,
//           employee_details: 1,
//           role: 1,
//         },
//       },
//       {
//         $addFields: {
//           label: {
//             $concat: ["$name", " (Mobile: ", "$mobile", ")"],
//           },
//           value: "$username",
//         },
//       },
//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//     ]);
//     if (!adminuser) {
//       return res.send({
//         error: "No user found for given role.",
//       });
//     }
//     return res.send({
//       status: 1,
//       message: "Query executed successfully.",
//       data: adminuser,
//     });
//   } catch (error) {
//     return res.send({ status: 0, message: error.message, data: "" });
//   }
// });

router.post("/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.adminuser.tokens = req.adminuser.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.adminuser.save();
    return res.send({ status: 1, message: "Logout successfully.", data: "" });
  } catch (error) {
    return res.send({ status: 0, message: "Something went wrong.", data: "" });
  }
});

// router.post("/logoutall", auth, async (req, res) => {
//   // Log user out of all devices
//   try {
//     req.adminuser.tokens.splice(0, req.adminuser.tokens.length);
//     await req.adminuser.save();
//    return res.send({
//       status: 1,
//       message: "Logout from all devices successfully.",
//       data: "",
//     });
//   } catch (error) {
//    return res.send({ status: 0, message: "Something went wrong.", data: "" });
//   }
// });

// router.post("/changepassword", auth, async (req, res) => {
//   try {
//     const { oldpwd, newpwd } = req.body;
//     const adminuser = await AdminUser.changepassword(
//       req.adminuser.username,
//       oldpwd,
//       newpwd
//     );

//     if (!adminuser) {
//      return res.send({ status: 0, message: "Data does not exist.", data: "" });
//     } else {
//      return res.send({
//         status: 1,
//         message: "Password updated successfully.",
//         data: "",
//       });
//     }
//   } catch (error) {
//    return res.send({ status: 0, message: "Something went wrong.", data: "" });
//   }
// });

// router.post("/resetpassword", auth, async (req, res) => {
//   try {
//     if (req.adminuser.role !== "Manager" && req.adminuser.role !== "Admin" && req.adminuser.role !== "Owner") {
//       return res.send({
//         status: 0,
//         message: "Only admin, owner, and manager can reset passwords.",
//         data: "",
//       });
//     } else {
//       const { username, newpwd } = req.body;
//       const adminuser = await AdminUser.resetpassword(username, newpwd);

//       if (!adminuser) {
//         return res.send({ status: 0, message: "Something went wrong.", data: "" });
//       } else {
//         return res.send({
//           status: 1,
//           message: "Password updated successfully.",
//           data: "",
//         });
//       }
//     }
//   } catch (error) {
//     return res.send({ status: 0, message: "Something went wrong.", data: "" });
//   }
// });

router.post("/update", auth, async (req, res) => {
  try {
    const { username, role } = req.body;
    const adminuser = await AdminUser.findOneAndUpdate(
      { username },
      { role },
      { new: true }
    );

    if (!adminuser) {
      return res.send({
        status: 0,
        message: "Something went wrong.",
        data: "",
      });
    } else {
      return res.send({
        status: 1,
        message: "User updated successfully.",
        data: adminuser,
      });
    }
  } catch (error) {
    return res.send({ status: 0, message: "Something went wrong.", data: "" });
  }
});

// router.post("/activate_deactivate", auth, async (req, res) => {
//   try {
//     const { username, is_active } = req.body;

//     const adminuser = await AdminUser.findOneAndUpdate(
//       { username },
//       { is_active },
//       { new: true }
//     );

//     if (!adminuser) {
//      return res.send({ status: 0, message: "Data does not exist.", data: "" });
//     } else {
//      return res.send({
//         status: 1,
//         message: "User updated successfully.",
//         data: adminuser,
//       });
//     }
//   } catch (error) {
//    return res.send({ status: 0, message: "Something went wrong.", data: "" });
//   }
// });

module.exports = router;
