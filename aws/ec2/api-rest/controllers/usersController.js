const db = require("../helpers/mysql-config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "123";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const [rows] = await db.execute(
      "SELECT id, bcrypt FROM Users WHERE email = ?",
      [email],
    );
    const user = rows[0];
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.bcrypt);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            error: "Email, nombre y contraseña requeridos"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            "INSERT INTO Users (name, email, bcrypt) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        const userId = result.insertId;
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

        return res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
    }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.user.userId;

  if (tokenUserId !== Number(userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const sql = `DELETE * FROM Users WHERE id = ?`;
    await db.execute(sql, [id]);
    res.status(200).json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

module.exports = { login, signup, deleteUser };
