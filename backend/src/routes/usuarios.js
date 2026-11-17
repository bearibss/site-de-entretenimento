const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { autorizaToken, senhaToken } = require("../middleware/autorizaToken");

const emailValido = (e) => /^\S+@\S+\.\S+$/.test(e);

// get usuarios
router.get("/", async (req, res) => {
    try {
        const r = await db.query("SELECT id,login,nome,email FROM usuarios");
        if (!r.rowCount) {
            throw new Error("Usuários não encontrados");
        }
        return res.status(200).json({ usuarios: r.rows });
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
});

// get por login
router.get("/:login", async (req, res) => {
    try {
        const r = await db.query("SELECT id,login,nome,email FROM usuarios WHERE login=$1", [req.params.login]);
        if (!r.rowCount) {
            throw new Error("Usuário não encontrado");
        }
        return res.status(200).json({ usuario: r.rows[0] });
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
});

// cadastro
router.post("/cadastro", async (req, res) => {
    try {
        const { login, nome, senha, email } = req.body;

        if (!login || !nome || !senha || !email) {
            throw new Error("Parâmetros inválidos");
        }
        if (login.length < 2) {
            throw new Error("Login inválido");
        }
        if (nome.length < 2) {
            throw new Error("Nome inválido");
        }
        if (senha.length < 5) {
            throw new Error("Senha inválida");
        }
        if (!emailValido(email)) {
            throw new Error("E-mail inválido");
        }
        const r1 = await db.query("SELECT 1 FROM usuarios WHERE login=$1", [login]);
        if (r1.rowCount) {
            throw new Error("Login já está em uso");
        }
        const r2 = await db.query("SELECT 1 FROM usuarios WHERE email=$1", [email]);
        if (r2.rowCount) {
            throw new Error("E-mail já está em uso");
        }
        const hash = await bcrypt.hash(senha, 12);

        const r3 = await db.query(
            "INSERT INTO usuarios(login,nome,senha,email) VALUES ($1,$2,$3,$4) RETURNING id,login,nome,email",
            [login, nome, hash, email]
        );
        if (!r3.rowCount) {
            throw new Error("Usuário não criado :(");
        }
        return res.status(201).json({ msg: "Usuário criado com sucesso :)", usuario: r3.rows[0] });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        const { login, senha } = req.body;
        if (!login || !senha) {
            throw new Error("Parâmetros inválidos");
        }
        if (login.length < 2) {
            throw new Error("Login inválido");
        }
        if (senha.length < 5) {
            throw new Error("Senha inválida");
        }
        const r1 = await db.query("SELECT * FROM usuarios WHERE login = $1", [login]);
        if (r1.rowCount == 0) {
            throw new Error("Login inválido");
        }
        const conferirSenha = await bcrypt.compare(senha, r1.rows[0].senha);
        if (!conferirSenha) {
            throw new Error("Senha inválida");
        }
        const criaToken = await jwt.sign(
            { data: r1.rows[0].id },
            senhaToken,
            {
                expiresIn: "60m",
                subject: r1.rows[0].login
            }
        );
        return res.status(200).json({
            msg: "Login realizado com sucesso :)",
            token: criaToken,
            id: r1.rows[0].id,
            login: r1.rows[0].login,
            nome: r1.rows[0].nome
        });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});

// edit
router.put("/:login", autorizaToken, async (req, res) => {
    try {
        const loginAtual = req.params.login;
        const { login, nome, senha, email } = req.body;
        if (!login || !nome || !senha || !email) {
            throw new Error("Parâmetros inválidos");
        }
        if (login.length < 2) {
            throw new Error("Login inválido");
        }
        if (nome.length < 2) {
            throw new Error("Nome inválido");
        }
        if (senha.length < 5) {
            throw new Error("Senha inválida");
        }
        if (!emailValido(email)) {
            throw new Error("E-mail inválido");
        }
        // "id <> $2": o próprio usuário pode manter o login/e-mail que já tem
        const r1 = await db.query("SELECT 1 FROM usuarios WHERE login=$1 AND id<>$2", [login, req.user]);
        if (r1.rowCount) {
            throw new Error("Login já está em uso");
        }
        const r2 = await db.query("SELECT 1 FROM usuarios WHERE email=$1 AND id<>$2", [email, req.user]);
        if (r2.rowCount) {
            throw new Error("E-mail já está em uso");
        }
        const hash = await bcrypt.hash(senha, 12);
        const r3 = await db.query(
            "UPDATE usuarios SET login=$1, nome=$2, senha=$3, email=$4 WHERE login=$5 AND id=$6",
            [login, nome, hash, email, loginAtual, req.user]
        );
        if (!r3.rowCount) {
            throw new Error("Não foi possível editar o usuário :(");
        }
        return res.status(200).json({ msg: "Usuário editado com sucesso :)" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// delete
router.delete("/:login", autorizaToken, async (req, res) => {
    try {
        const login = req.params.login;
        if (!login) {
            throw new Error("Login não encontrado");
        }
        const r = await db.query("DELETE FROM usuarios WHERE login=$1 AND id=$2", [login, req.user]);
        if (!r.rowCount) {
            throw new Error("Não foi possível deletar o usuário");
        }
        return res.status(200).json({ msg: "Usuário deletado" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

module.exports = router;