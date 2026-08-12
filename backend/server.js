const conexao = require("./database");
const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

const PORT = 3000;

app.use(express.json());

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

        // Usuário não encontrado
        if (resultados.length === 0) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Email ou senha incorretos."
            });
        }

        const usuario = resultados[0];

        // Compara a senha digitada com o hash do banco
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

        // Login correto
        res.json({
            sucesso: true,
            mensagem: "Login realizado com sucesso!"
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

                    res.status(500).json({
                        sucesso: false,
                        mensagem: "Erro ao cadastrar usuário."
                    });

                    return;
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

app.listen(PORT, () =>{
    console.log(`Servidor funcinando na porta ${PORT}`)
})