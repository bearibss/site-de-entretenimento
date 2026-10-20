const CHAVE = "resenha:albuns";

function ler() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE)) || [];
    } catch {
        return [];
    }
}

function gravar(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

export function listarAlbuns() {
    return ler();
}

export function buscarAlbum(id) {
    return ler().find((a) => a.id === id) || null;
}

export function salvarAlbum(album) {
    const lista = ler();
    const novo = { ...album, id: crypto.randomUUID(), criadoEm: Date.now() };
    lista.unshift(novo);
    gravar(lista);
    return novo;
}


export function atualizarAlbum(id, mudancas) {
    const lista = ler();
    const i = lista.findIndex((a) => a.id === id);
    if (i === -1) return null;

    const atual = lista[i];
    const limpo = {};

    for (const campo in mudancas) {
        const valor = mudancas[campo];
        const vazio =
            valor === "" ||
            valor === null ||
            valor === undefined ||
            (campo === "nota" && Number(valor) === 0);

        if (!vazio) limpo[campo] = valor;
    }

    lista[i] = { ...atual, ...limpo, atualizadoEm: Date.now() };
    gravar(lista);
    return lista[i];
}

export function removerAlbum(id) {
    gravar(ler().filter((a) => a.id !== id));
}