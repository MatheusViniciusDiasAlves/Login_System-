const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

app.post("/login", (req, res) => {
    console.log(req.body);

    res.json({
        mensagem: "Dados recebidos pelo backend!"
    });
});

app.listen(PORT, () =>{
    console.log(`Servidor funcinando na porta ${PORT}`)
})