const express = require("express");
const router = express.Router();
const db = require("../db");
const { autorizaToken } = require("../middleware/autorizaToken");
const { garantirAlbum } = require("../services/albuns");

const SELECT_REVIEW = `
    SELECT r.id, r.titulo, r.texto, r.nota,
           r.criado_em AS "criadoEm", r.atualizado_em AS "atualizadoEm",
           u.id AS "usuarioId", u.nome AS "autor", u.login AS "autorLogin",
           a.id AS "albumId", a.itunes_id AS "itunesId", a.titulo AS "albumTitulo",
           a.artista, a.capa_url AS "capaUrl", a.data_lancamento AS "dataLancamento"
    FROM reviews r
    JOIN usuarios u ON u.id = r.usuario_id
    JOIN albuns   a ON a.id = r.album_id`;

function validar({ titulo, texto, nota }) {
    if (!titulo || !String(titulo).trim()) throw new Error("Informe o título da resenha");
    if (String(titulo).length > 150) throw new Error("O título pode ter até 150 caracteres");
    if (!texto || !String(texto).trim()) throw new Error("Escreva o texto da resenha");
    const n = Number(nota);
    if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error("A nota deve ser um inteiro de 1 a 5");
}

// feed/listagens: GET /reviews?itunesId=123 | ?usuarioId=1 | sem filtro = mais recentes
router.get("/", async (req, res) => {
    try {
        const filtros = [];
        const params = [];
        if (req.query.itunesId) {
            params.push(Number(req.query.itunesId));
            filtros.push(`a.itunes_id = $${params.length}`);
        }
        if (req.query.usuarioId) {
            params.push(Number(req.query.usuarioId));
            filtros.push(`u.id = $${params.length}`);
        }
        const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
        const limite = Math.min(Number(req.query.limite) || 30, 100);
        const r = await db.query(`${SELECT_REVIEW} ${where} ORDER BY r.criado_em DESC LIMIT ${limite}`, params);
        return res.status(200).json({ resenhas: r.rows });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// minhas resenhas (perfil)
router.get("/minhas", autorizaToken, async (req, res) => {
    try {
        const r = await db.query(`${SELECT_REVIEW} WHERE r.usuario_id = $1 ORDER BY r.criado_em DESC`, [req.user]);
        return res.status(200).json({ resenhas: r.rows });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// get por id
router.get("/:id", async (req, res) => {
    try {
        const r = await db.query(`${SELECT_REVIEW} WHERE r.id = $1`, [Number(req.params.id) || 0]);
        if (!r.rowCount) {
            throw new Error("Resenha não encontrada");
        }
        return res.status(200).json({ resenha: r.rows[0] });
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
});

// publicar: { itunesId, titulo, texto, nota }
router.post("/", autorizaToken, async (req, res) => {
    try {
        validar(req.body);
        const itunesId = Number(req.body.itunesId);
        if (!Number.isInteger(itunesId)) {
            throw new Error("Informe o itunesId do álbum");
        }
        const album = await garantirAlbum(itunesId);
        if (!album) {
            throw new Error("Álbum não encontrado na API externa");
        }
        const dup = await db.query("SELECT 1 FROM reviews WHERE usuario_id=$1 AND album_id=$2", [req.user, album.id]);
        if (dup.rowCount) {
            throw new Error("Você já resenhou este álbum. Edite a resenha existente");
        }
        const r = await db.query(
            "INSERT INTO reviews(titulo,texto,nota,album_id,usuario_id) VALUES ($1,$2,$3,$4,$5) RETURNING id",
            [req.body.titulo.trim(), req.body.texto.trim(), Number(req.body.nota), album.id, req.user]
        );
        const completa = await db.query(`${SELECT_REVIEW} WHERE r.id = $1`, [r.rows[0].id]);
        return res.status(201).json({ msg: "Resenha publicada :)", resenha: completa.rows[0] });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});

// editar (só o autor)
router.put("/:id", autorizaToken, async (req, res) => {
    try {
        validar(req.body);
        const id = Number(req.params.id) || 0;
        const r = await db.query(
            `UPDATE reviews SET titulo=$1, texto=$2, nota=$3, atualizado_em=NOW()
             WHERE id=$4 AND usuario_id=$5`,
            [req.body.titulo.trim(), req.body.texto.trim(), Number(req.body.nota), id, req.user]
        );
        if (!r.rowCount) {
            throw new Error("Resenha não encontrada ou não pertence a você");
        }
        return res.status(200).json({ msg: "Resenha editada com sucesso :)" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});

// excluir (só o autor)
router.delete("/:id", autorizaToken, async (req, res) => {
    try {
        const r = await db.query("DELETE FROM reviews WHERE id=$1 AND usuario_id=$2", [Number(req.params.id) || 0, req.user]);
        if (!r.rowCount) {
            throw new Error("Resenha não encontrada ou não pertence a você");
        }
        return res.status(200).json({ msg: "Resenha deletada" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});

module.exports = router;