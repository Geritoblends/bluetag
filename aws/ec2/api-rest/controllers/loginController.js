const db = require("../helpers/mysql-config.js");

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email & password required" });

    try {
        const [rows] = await db.execute(
            "SELECT id, bcrypt FROM users WHERE email = ?",
            [email],
        );
        const user = rows[0];
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}
