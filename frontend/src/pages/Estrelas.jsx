import { useState } from "react";

function Estrelas({ nota, aoMudar, somenteLeitura = false }) {
    const [passando, setPassando] = useState(0);
    const valores = [1, 2, 3, 4, 5];

    if (somenteLeitura) {
        return (
            <span className="estrelas estrelasLeitura">
                {valores.map((v) => (
                    <span key={v} className={v <= nota ? "estrela cheia" : "estrela"}>
                        ★
                    </span>
                ))}
            </span>
        );
    }

    return (
        <div className="estrelas" onMouseLeave={() => setPassando(0)}>
            {valores.map((v) => (
                <button
                    key={v}
                    type="button"
                    className={v <= (passando || nota) ? "estrela cheia" : "estrela"}
                    onMouseEnter={() => setPassando(v)}
                    onClick={() => aoMudar(v === nota ? 0 : v)}
                    aria-label={`Dar nota ${v}`}
                >
                    ★
                </button>
            ))}
            <span className="estrelasTexto">
                {nota > 0 ? `${nota} de 5` : "sem nota"}
            </span>
        </div>
    );
}

export default Estrelas;