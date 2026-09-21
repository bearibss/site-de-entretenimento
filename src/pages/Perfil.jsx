import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Estrelas from "./Estrelas";
import { listarAlbuns, removerAlbum } from "../services/albuns";

function Perfil() {
    const navegar = useNavigate();
    const [albuns, setAlbuns] = useState([]);

    useEffect(() => {
        setAlbuns(listarAlbuns());
    }, []);

    function excluir(id) {
        removerAlbum(id);
        setAlbuns(listarAlbuns());
    }

    return (
        <div className="fundo">
            <Nav />

            <main className="paginaPerfil">
                <header className="cabecalhoPerfil">
                    <h1>Meu perfil</h1>
                    <p>Tudo que você ouviu e resenhou fica reunido aqui.</p>
                </header>

                <section className="meusAlbuns">
                    <h2>Meus Álbuns</h2>

                    {albuns.length === 0 ? (
                        <div className="vazio">
                            <p>Você ainda não resenhou nenhum álbum.</p>
                            <button
                                className="btnCadastrar"
                                onClick={() => navegar("/albuns/novo")}
                            >
                                Cadastrar Álbuns
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="dicaEdicao">
                                Dê dois cliques no nome de um álbum para editá-lo.
                            </p>

                            <ul className="listaAlbuns">
                                {albuns.map((album) => (
                                    <li key={album.id} className="itemAlbum">
                                        <div className="capaItem">
                                            {album.capa ? (
                                                <img src={album.capa} alt={`Capa de ${album.nome}`} />
                                            ) : (
                                                <span>sem capa</span>
                                            )}
                                        </div>

                                        <div className="dadosItem">
                                            <h3
                                                className="nomeAlbum"
                                                title="Dois cliques para editar"
                                                onDoubleClick={() =>
                                                    navegar(`/albuns/editar/${album.id}`)
                                                }
                                            >
                                                {album.nome}
                                            </h3>

                                            <p className="artistaAlbum">
                                                {album.artista}
                                                {album.ano ? ` · ${album.ano}` : ""}
                                            </p>

                                            <Estrelas nota={album.nota} somenteLeitura />

                                            {album.resenha && (
                                                <p className="resenhaAlbum">{album.resenha}</p>
                                            )}
                                        </div>

                                        <button
                                            className="btnRemover"
                                            onClick={() => excluir(album.id)}
                                            aria-label={`Remover ${album.nome}`}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Perfil;