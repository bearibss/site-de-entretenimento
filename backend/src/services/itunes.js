const BASE = "https://itunes.apple.com";

function normalizar(item) {
    return {
        itunesId: item.collectionId,
        titulo: item.collectionName,
        artista: item.artistName,
        // artworkUrl100 é pequena; trocamos o tamanho na própria URL
        capaUrl: item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "600x600bb") : null,
        dataLancamento: item.releaseDate ? item.releaseDate.slice(0, 10) : null,
        genero: item.primaryGenreName || null,
    };
}

async function chamar(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`iTunes API respondeu ${r.status}`);
    return r.json();
}

async function buscarAlbunsItunes(termo, limite = 24) {
    const url = `${BASE}/search?term=${encodeURIComponent(termo)}&media=music&entity=album&limit=${limite}&country=BR`;
    const dados = await chamar(url);
    return dados.results.filter((i) => i.collectionId).map(normalizar);
}

async function buscarAlbumItunes(itunesId) {
    const dados = await chamar(`${BASE}/lookup?id=${encodeURIComponent(itunesId)}&entity=album&country=BR`);
    const item = dados.results.find((i) => i.wrapperType === "collection");
    return item ? normalizar(item) : null;
}

module.exports = { buscarAlbunsItunes, buscarAlbumItunes };
