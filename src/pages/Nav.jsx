import { useNavigate } from "react-router-dom";

function Nav() {
    const navegar = useNavigate();

    return (
        <nav className="nav">
            <div className="logo">
                <h2>Resenha</h2>
            </div>

            <div className="navBotoes">
                <button onClick={() => navegar("/")}>
                    Início
                </button>

                <button onClick={() => navegar("/cadastro")}>
                    Criar conta
                </button>
            </div>
        </nav>
    );
}

export default Nav;