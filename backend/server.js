
const conexao = require("./database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

function autenticarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Token não fornecido."
        });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Formato do token inválido."
        });
    }

    const token = partes[1];

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (erro) {

        return res.status(401).json({
            sucesso: false,
            mensagem: "Token inválido ou expirado."
        });
    }
}



app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE email = ?
    `;

    conexao.query(sql, [email], async (erro, resultados) => {

        if (erro) {

            console.log("Erro ao consultar usuário:", erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno do servidor."
            });
        }

        if (resultados.length === 0) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Email ou senha incorretos."
            });
        }

        const usuario = resultados[0];

        const senhaCorreta = await bcrypt.compare(
            password,
            usuario.senha
        );

        if (!senhaCorreta) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Email ou senha incorretos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            sucesso: true,
            mensagem: "Login realizado com sucesso!",
            token: token
        });
    });
});


app.post("/cadastro", async (req, res) => {

    const { nome, email, senha } = req.body;

    try {

        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        conexao.query(
            sql,
            [nome, email, senhaHash],
            (erro, resultado) => {

                if (erro) {

                    console.log("Erro ao cadastrar:", erro);

                    return res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao cadastrar usuário."
                    });
                }

                console.log("Usuário cadastrado com sucesso!");

                res.json({
                    sucesso: true,
                    mensagem: "Usuário cadastrado com sucesso!"
                });
            }
        );

    } catch (erro) {

        console.log("Erro ao gerar senha:", erro);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});


app.get("/perfil", autenticarToken, (req, res) => {

    console.log("Usuário autenticado:", req.usuario);

    res.json({
        sucesso: true,
        mensagem: "Você acessou seu perfil!",
        usuario: req.usuario
    });
});


app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});