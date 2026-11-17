CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    login VARCHAR(80) UNIQUE NOT NULL,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha VARCHAR(60) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE albuns(
    id SERIAL PRIMARY KEY,
    itunes_id BIGINT UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    artista VARCHAR(255) NOT NULL,
    capa_url TEXT,
    data_lancamento DATE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    texto TEXT NOT NULL,
    nota SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ,
    album_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    UNIQUE (usuario_id, album_id),
    CONSTRAINT fk_review_album FOREIGN KEY(album_id) REFERENCES albuns(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);