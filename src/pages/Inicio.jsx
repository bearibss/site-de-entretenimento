import Login from "./Login";
import Nav from "./Nav";

function Inicio() {
    return (
        <div className="fundo">
            <Nav />

            <main className="inicio">
                <section className="apresentacao">
                    <h1>Música é língua de gente</h1>

                    <h2>
                        Ouça. Sinta. Diga o que pensa.
                    </h2>

                    <p>
                        Um espaço para descobrir, ouvir e compartilhar
                        opiniões sobre seus álbuns favoritos.
                    </p>

                    <p>
                        Entre na sua conta para conhecer as resenhas
                        e participar da comunidade.
                    </p>
                </section>

                <Login />
            </main>
        </div>
    );
}

export default Inicio;