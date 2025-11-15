const express = require("express");
const cors = require("cors");
const signup = require("./routes/signup");
const login = require("./routes/login");
const tags = require("./routes/tags");
const usersTags = require("./routes/userstags");
const updates = require("./routes/updates");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", signup);
app.use("/", login);
app.use("/", tags);
app.use("/", usersTags);
app.use("/", updates);
// app.get("/", (req, res) => res.send("Backend de Bluetag"));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
