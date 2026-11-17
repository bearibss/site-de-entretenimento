const jwt = require("jsonwebtoken");
const db = require("../db");
const senhaToken = process.env.JWT_SECRET || "tokenUsuario";

function autorizaToken(req, res, next) {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(403).json({ msg: "Token inválido" });
        }

        jwt.verify(token, senhaToken, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ msg: "Token inválido" });
            }
            try {
                const r = await db.query("SELECT COUNT(*) as qtde FROM usuarios WHERE id = $1", [decoded.data]);
                if (parseInt(r.rows[0].qtde) == 0) {
                    return res.status(403).json({ msg: "Token inválido" });
                }
                req.user = decoded.data;
                next();
            } catch (error) {
                return res.status(500).json({ msg: error.message });
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = { autorizaToken, senhaToken };
