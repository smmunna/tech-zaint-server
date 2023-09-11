const router = require("express").Router();
const con = require("../../db/connection");
const upload = require("../../components/uploadImage/uploadImage");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var validator = require("email-validator");
var jwt = require('jsonwebtoken');


/**
 * --------------------------------------------------------------------------------------------
 * Authorization Started , After login=> verifying is he user or not .
 * --------------------------------------------------------------------------------------------
 * ***/

// Sign In JWT TOken
router.post('/jwt', (req, res) => {
  const user = req.body.email;
  // console.log(user);
  const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h'
  })
  // console.log(token)
  res.send({ token })

})

//Important function
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization
  // console.log(authorization)
  if (!authorization) {
    return res.send({ error: 'Error occured', message: "You are not authorized person, Contact with admin or info@techzaint.com" })
  }
  const token = authorization.split(' ')[1]
  // console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decode) => {
    if (error) {
      return res.send({ error: 'Error occured', message: "You can not access this." })
    }
    req.decode = decode
    next()
  })
}

/**
 * --------------------------------------------------------------------------------------------
 * Authorization part complted
 * --------------------------------------------------------------------------------------------
 * ***/


// Finding the user role;
router.get("/user-role",(req,res)=>{
  const reqEmail = req.query.email;
  try {
    const sql = `SELECT role FROM user_info WHERE email=?`;
    con.query(sql, [reqEmail], (err, result) => {
      if (err) return res.send({ error: err.message });
      res.send(result[0]);
    });
  } catch (error) {
    res.send({ error: error.message });
  }

})



// User info;
router.get("/user-info", (req, res) => {
  // console.log(req.headers.authorization)
  // const decode = req.decode
  // console.log('Comeback after decode',decode.user)

  const reqEmail = req.query.email;
  // if (decode.user !== reqEmail) {
  //   res.status(403).send("Unauthorized access")
  // }
  try {
    const sql = `SELECT name,email,phone,photo,dob,presentaddress,permanentaddress,profession,role FROM user_info WHERE email=?`;
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
