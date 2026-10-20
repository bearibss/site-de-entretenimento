import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./Nav";
import Estrelas from "./Estrelas";
import { buscarAlbum, salvarAlbum, atualizarAlbum } from "../services/albuns";

function CadastrarAlbum() {
    const { id } = useParams();
    const navegar = useNavigate();
    const editando = Boolean(id);

    // Campos sempre começam do zero, inclusive na edição.
    const [capa, setCapa] = useState("");
    const [nome, setNome] = useState("");
    const [artista, setArtista] = useState("");
    const [ano, setAno] = useState("");
    const [resenha, setResenha] = useState("");
    const [nota, setNota] = useState(0);

    const [original, setOriginal] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!editando) return;
        const album = buscarAlbum(id);
        if (!album) {
            navegar("/perfil");
            return;
        }
        setOriginal(album);
    }, [id, editando, navegar]);

    function lerCapa(e) {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        const leitor = new FileReader();
        leitor.onload = () => setCapa(leitor.result);
        leitor.readAsDataURL(arquivo);
    }

    function postar(e) {
        e.preventDefault();

        if (editando) {
            atualizarAlbum(id, { capa, nome, artista, ano, resenha, nota });
            navegar("/perfil");
            return;
        }

        if (!nome.trim() || !artista.trim()) {
            setErro("Preencha o nome do álbum e do artista para postar.");
            return;
        }

        salvarAlbum({
            capa,
            nome: nome.trim(),
            artista: artista.trim(),
            ano,
            resenha,
            nota,
        });
        navegar("/perfil");
    }

    const previa = capa || original?.capa || "";

    return (
        <div className="fundo">
            <Nav />

            <main className="paginaAlbum">
                <form className="cartaoAlbum" onSubmit={postar}>
                    <h1>{editando ? "Editar álbum" : "Cadastrar álbum"}</h1>

                    {editando && (
                        <p className="avisoEdicao">
                            Os campos estão em branco de propósito. Preencha só o que
                            quer trocar — o que ficar vazio mantém o valor atual de{" "}
                            <strong>{original?.nome}</strong>.
                        </p>
                    )}

                    <div className="linhaAlbum">
                        <label className="campoCapa">
                            <span className="rotulo">Capa do álbum</span>
                            <div className="previaCapa">
                                {previa ? (
                                    <img src={previa} alt="Capa do álbum" />
                                ) : (
                                    <span>Escolher imagem</span>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={lerCapa} />
                        </label>

                        <div className="camposTexto">
                            <label className="rotulo">
                                Nome do álbum
                                <input
                                    type="text"
                                    value={nome}
                                    placeholder={original?.nome || "Ex.: Clube da Esquina"}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </label>

                            <label className="rotulo">
                                Cantor ou banda
                                <input
                                    type="text"
                                    value={artista}
                                    placeholder={original?.artista || "Ex.: Milton Nascimento"}
                                    onChange={(e) => setArtista(e.target.value)}
                                />
                            </label>

                            <label className="rotulo">
                                Ano de lançamento
                                <input
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    value={ano}
                                    placeholder={original?.ano || "Ex.: 1972"}
                                    onChange={(e) => setAno(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>

                    <label className="rotulo">
                        Sua resenha
                        <textarea
                            rows="6"
                            value={resenha}
                            placeholder={original?.resenha || "O que esse álbum te fez sentir?"}
                            onChange={(e) => setResenha(e.target.value)}
                        />
                    </label>

                    <div className="rotulo">
                        Sua nota
                        <Estrelas nota={nota} aoMudar={setNota} />
                        {editando && original?.nota > 0 && nota === 0 && (
                            <small className="notaAtual">
                                Nota atual: {original.nota} de 5
                            </small>
                        )}
                    </div>

                    {erro && <p className="erro">{erro}</p>}

                    <div className="acoesAlbum">
                        <button type="button" className="btnFantasma" onClick={() => navegar(-1)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btnPostar">
                            POSTAR
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default CadastrarAlbum;