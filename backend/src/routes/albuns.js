const express = require("express");
const router = express.Router();
const db = require("../db");
const { buscarAlbunsItunes, buscarAlbumItunes } = require("../services/itunes");

const SELECT_ALBUM = `
    SELECT a.id, a.itunes_id AS "itunesId", a.titulo, a.artista,
           a.capa_url AS "capaUrl", a.data_lancamento AS "dataLancamento",
           ROUND(AVG(r.nota), 1)::float AS media,
           COUNT(r.id)::int AS "totalResenhas"
    FROM albuns a
    LEFT JOIN reviews r ON r.album_id = a.id`;

// busca na iTunes API: GET /albuns/buscar?q=clube da esquina
router.get("/buscar", async (req, res) => {
    try {
        const q = String(req.query.q || "").trim();
        if (q.length < 2) {
            return res.status(400).json({ msg: "Digite ao menos 2 caracteres" });
        }
        return res.status(200).json({ albuns: await buscarAlbunsItunes(q) });
    } catch (error) {
        console.error(error);
        return res.status(502).json({ msg: "Não foi possível consultar a API de álbuns" });
    }
});

// catálogo da plataforma (álbuns já registrados + média das notas)
router.get("/", async (req, res) => {
    try {
        const r = await db.query(`${SELECT_ALBUM} GROUP BY a.id ORDER BY a.criado_em DESC LIMIT 60`);
        return res.status(200).json({ albuns: r.rows });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// detalhes: banco primeiro; se ainda não existe, cai para a iTunes API
router.get("/:itunesId", async (req, res) => {
    try {
        const itunesId = Number(req.params.itunesId);
        if (!Number.isInteger(itunesId)) {
            return res.status(400).json({ msg: "ID inválido" });
        }
        const r = await db.query(`${SELECT_ALBUM} WHERE a.itunes_id = $1 GROUP BY a.id`, [itunesId]);
        if (r.rowCount) {
            return res.status(200).json({ album: r.rows[0] });
        }
        const externo = await buscarAlbumItunes(itunesId);
        if (!externo) {
            return res.status(404).json({ msg: "Álbum não encontrado" });
        }
        return res.status(200).json({ album: { ...externo, id: null, media: null, totalResenhas: 0 } });
    } catch (error) {
        console.error(error);
        return res.status(502).json({ msg: "Não foi possível consultar a API de álbuns" });
    }
});

module.exports = router;