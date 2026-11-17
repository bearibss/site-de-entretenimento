const db = require("../db");
const { buscarAlbumItunes } = require("./itunes");

// Devolve o álbum do banco; se não existir, busca na iTunes API e cadastra.
// ON CONFLICT evita duplicata mesmo com requisições simultâneas.
async function garantirAlbum(itunesId) {
    const existente = await db.query("SELECT * FROM albuns WHERE itunes_id = $1", [itunesId]);
    if (existente.rows[0]) return existente.rows[0];

    const a = await buscarAlbumItunes(itunesId);
    if (!a) return null;

    const r = await db.query(
        `INSERT INTO albuns (itunes_id, titulo, artista, capa_url, data_lancamento)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (itunes_id) DO UPDATE SET itunes_id = EXCLUDED.itunes_id
         RETURNING *`,
        [a.itunesId, a.titulo, a.artista, a.capaUrl, a.dataLancamento]
    );
    return r.rows[0];
}

module.exports = { garantirAlbum };
