const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    console.log("Login recebido:");
    console.log("Email:", email);
    console.log("Senha:", password);

    res.json({
        sucesso: true,
        mensagem: "Login recebido pelo backend!"
    });
});

app.post("/cadastro", (req, res) =>{

    const {nome, email, senha} = req.body;

    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Senha:", senha);

    res.json({
        sucesso: true,
        mensagem: "Cadastro recebido pelo backend!"
    });
})

app.listen(PORT, () =>{
    console.log(`Servidor funcinando na porta ${PORT}`)
})