const db = require("../helpers/mysql-config.js");
const bcrypt = require("bcrypt");

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "Email, nombre y contraseña requeridos" });

  const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, bcrypt) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );
    const userId = result.insertId;

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
