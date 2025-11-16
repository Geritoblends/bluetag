const express = require("express");
const cors = require("cors");
const users = require("./routes/users");
const tags = require("./routes/tags");
const updates = require("./routes/updates");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", users);
app.use("/", tags);
app.use("/", updates);
// app.get("/", (req, res) => res.send("Backend de Bluetag"));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
