import { useNavigate } from "react-router-dom";
import {useState} from "react"
function Login () {
    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")
    const navegar = useNavigate()
    async function verificaLogin () {
        try {
            let r = await fetch("http://localhost:3000/usuarios/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usuario, senha })
            })
      
            if (r.ok) {
              const dados = await r.json()
              console.log(dados)
              navegar(`/feed/${dados.usuario.id}`)
            } else {
              let dadosErro = await r.json();
              console.log (dadosErro)
            }
      
          } catch (error) {
            console.log("Erro:", error)
          }
      
        }

    }
    function irParaCadastro () {
        navegar ('/cadastro')
    }
    return (
    <>
    <div className = "divInputs">
        <h3>Entre em sua conta</h3>
        <form className = "formInputs" onSubmit = {(e) => {e.preventDefault(); verificaLogin()}}>
            <input type="text" placeholder="usuario" onChange = {(e) => setUsuario (e.target.value)} name = "usuario" required /> <br />
            <input type="text" placeholder = "senha" onChange = {(e) => setSenha (e.target.value)} name = "senha" required /> <br /> 
            <button type="submit">Entrar</button> <br />
            <button onClick={irParaCadastro}>Criar nova conta</button>
        </form>
    </div>
    </>
)

export default Login