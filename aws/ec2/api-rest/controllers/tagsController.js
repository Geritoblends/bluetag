const db = require("../helpers/mysql-config");

const getMyTags = async (req, res) => {
  const userId = req.params.userId;
  const tokenUserId = req.user.userId;

  if (tokenUserId !== Number(userId)) {
    return res.status(403).json({ error: "Usuario no autorizado" });
  }

  const sql = "SELECT * FROM Tags WHERE user_id = ?";
  const [rows] = await db.execute(sql, [userId]);
  if (!rows.length)
    return res
      .status(404)
      .json({ error: "No existen tags asociados al usuario" });
  res.json(rows);
};

const getMyTag = async (req, res) => {
  const userId = req.params.userId;
  const tokenUserId = req.user.userId;

  if (tokenUserId !== Number(userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const sql = "SELECT * FROM Tags WHERE user_id = ? AND id = ?";
  const [rows] = await db.execute(sql, [userId, req.params.tagId]);
  if (!rows.length) return res.status(404).json({ error: "Tag no encontrado" });
  res.json(rows[0]);
};

const insertMyTag = async (req, res) => {
  const { userId } = req.params;
  const tokenUserId = req.user.userId;
  const { mac_address, last_distance, alias, icon, last_date } = req.body;

  if (tokenUserId !== Number(userId)) {
    return res.status(403).json({ error: "Usuario no autorizado" });
  }

  try {
    const sql = `INSERT INTO Tags (user_id, mac_address, last_distance, alias, icon, last_date) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      userId,
      mac_address || null,
      last_distance || null,
      alias || null,
      icon || null,
      last_date || null,
    ]);

    res.status(201).json({
      id: result.insertId,
      user_id: Number(userId),
      mac_address,
      last_distance,
      alias,
      icon,
      last_date,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const deleteMyTag = async (req, res) => {
  const { userId, tagId } = req.params;
  const tokenUserId = req.user.userId;

  if (tokenUserId !== Number(userId)) {
    return res.status(403).json({ error: "Usuario no autorizado" });
  }

  try {
    const sql = `DELETE * FROM Tags WHERE user_id = ? AND id = ?`;
    await db.execute(sql, [userId, tagId]);
    res.status(200).json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

module.exports = { getMyTags, getMyTag, insertMyTag, deleteMyTag };
