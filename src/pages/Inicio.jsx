import Feed from './Feed'
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";

function Inicio() {
    const navegar = useNavigate();
    return (
        <div className="fundo">
            <Nav />

            <main className="inicio">
                <section className="apresentacao">
                    <h1>Música é língua de gente</h1>

                    <h2>
                        Ouça. Sinta. Diga o que pensa.
                    </h2>

                  
                </section>
                <section >

                    <img src="../src/imgs/albuns.png" alt=""  className='albuns'/>
                </section>
                <h3>
                        Um espaço para descobrir, ouvir e compartilhar
                        opiniões sobre seus álbuns favoritos.
                    </h3>

                    <h4>
                        Entre na sua conta para conhecer as resenhas
                        e participar da comunidade.
                    </h4>
                    <button className='login' onClick={() => navegar("/login")}>
                        Entrar na conta
                    </button>

            </main>
        </div>
    );
}

export default Inicio;