const router = require("express").Router();
const con = require("../../db/connection");
const upload = require("../../components/uploadImage/uploadImage");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var validator = require("email-validator");

// User info;
router.get("/user-info", (req, res) => {
  const reqEmail = req.query.email;
  try {
    const sql = `SELECT name,email,phone,photo,dob,presentaddress,permanentaddress,profession FROM user_info WHERE email=?`;
    con.query(sql, [reqEmail], (err, result) => {
      if (err) return res.send({ error: err.message });
      res.send(result[0]);
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// User Login
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (validator.validate(email) == false) {
    return res.send({ error: "Invalid email format..!" });
  }

  try {
    const sql = `SELECT * FROM user_info WHERE email=?`;
    con.query(sql, [email], (err, result) => {
      if (err) res.send({ error: "database error" });
      const dbEmail = result[0]?.email;

      if (email == dbEmail) {
        bcrypt.compare(password, result[0].password, function (err, result) {
          if (result === true) {
            res.send({
              result: "Login successfull",
              status: "ok",
              email: email,
            });
          } else {
            res.send({ error: "Invalid username/password" });
          }
        });
      } else {
        res.send({ error: "Invalid username/password" });
      }
    });
  } catch (error) {
    res.send({ error: "Invalid username/password" });
  }
});

// User registration
router.post("/", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const {
    name,
    email,
    password,
    gender,
    phone,
    dob,
    presentaddress,
    permanentaddress,
    profession,
    instituition,
  } = req.body;

  const photo = "http://localhost:3000/" + req.file.path.replace("\\", "/");

  try {
    const emailSql = `SELECT email FROM user_info WHERE email= ?`;
    con.query(emailSql, [email], (err, result) => {
      if (err) {
        res.send(err);
      }
      const checkEmail = result[0]?.email;
      if (email === checkEmail) {
        res.send({ exist: "Email already exist" });
        return;
      } else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          // Store hash in your password DB.
          const sql = `INSERT INTO
          user_info( name, email, password, gender, phone, dob, presentaddress, permanentaddress, profession, instituition, photo) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          con.query(
            sql,
            [
              name,
              email,
              hash,
              gender,
              phone,
              dob,
              presentaddress,
              permanentaddress,
              profession,
              instituition,
              photo,
            ],
            (err, result) => {
              if (err) throw err;
              res.send({
                message: "User hasbeen created successfully",
                status: "ok",
              });
            }
          );
        });
      }
    });
  } catch (error) {
    res.send({
      error: "Something went wrong",
    });
  }
});

router.get("/", (req, res) => {
  res.send("I am from User router");
});

module.exports = router;
