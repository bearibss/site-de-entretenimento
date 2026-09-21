import { useNavigate } from "react-router-dom";

function Nav() {
    const navegar = useNavigate();

    return (
        <nav className="nav">
            <div className="logo" onClick={() => navegar("/")}>
                <h2>Resenha</h2>
            </div>

            <div className="navBotoes">
                <button className="btnNav" onClick={() => navegar("/")}>
                    Início
                </button>

                <button className="btnNav" onClick={() => navegar("/perfil")}>
                    Meu perfil
                </button>

                <button className="btnCadastrar" onClick={() => navegar("/albuns/novo")}>
                    Cadastrar Álbuns
                </button>
            </div>
        </nav>
    );
}

export default Nav;