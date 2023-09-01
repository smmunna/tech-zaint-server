var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"tech_zaint"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("TechZaint Database hasbeen Connected!");
});

module.exports = con