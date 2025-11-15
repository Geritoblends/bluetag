const mysql = require("mysql2");

export default const db = mysql.createPool({
  host: "127.0.0.1",
  user: "nodeuser",
  password: "strongpassword",
  database: "bluetag",
});
