const db = require("../helpers/mysql-config");

const getMyTagUpdates = async (req, res) => {
  const { userId, tagId } = req.params;
  const tokenUserId = req.user.userId;

  if (tokenUserId !== Number(userId)) {
    return res.status(403).json({ error: "Usuario no autorizado" });
  }

  try {
    const sql = `SELECT * FROM Updates WHERE tag_id = ?`;
    const [rows] = await db.execute(sql, [tagId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

module.exports = { getMyTagUpdates };
