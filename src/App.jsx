import { Route, Routes } from "react-router-dom";
import "./App.css";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Inicio from "./pages/Inicio";
import Perfil from "./pages/Perfil";
import CadastrarAlbum from "./pages/CadastrarAlbum";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed/:id" element={<Feed />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/albuns/novo" element={<CadastrarAlbum />} />
            <Route path="/albuns/editar/:id" element={<CadastrarAlbum />} />
        </Routes>
    );
}

export default App;