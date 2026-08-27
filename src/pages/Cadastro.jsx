import { useNavigate } from "react-router-dom";
import {useState} from "react"
function Cadastro () {
    const [nome, setNome] = useState()
    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")
    const navegar = useNavigate();
    function irParaLogin () {
        navegar ("/login")
    }
    async function verificaCadastro (){
        try {
            let r = await fetch("http://localhost:3000/usuarios", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usuario, senha, nome})
            })
      
            if (r.ok) {
              const dados = await r.json()
              console.log(dados)
              navegar(`/login`)
            }else {
              const dados = await r.json()
            console.log (dados)
            }
          
          } catch (error) {
      
            console.log("Erro:", error)
          }
      
    }
    return (
        <>
        <div className = "divInputs">
            <h3>Cadastre-se</h3>
            <form className = "formInputs" onSubmit = {(e) => {e.preventDefault(); verificaCadastro()}}>
            <input type="text" placeholder="nome" onChange = {(e) => setNome (e.target.value)} name ="nome" required /> <br />
                <input type="text" placeholder="usuario" onChange = {(e) => setUsuario (e.target.value)} name = "usuario" required /> <br />
                <input type="text" placeholder = "senha" onChange = {(e) => setSenha (e.target.value)} name = "senha" required /> <br /> 
                <button type="submit">Cadastrar-se</button> <br />
                <button onClick={irParaLogin}>Já tem uma conta? Entrar</button>
            </form>
        </div>
        </>
    )
}
export default Cadastro;