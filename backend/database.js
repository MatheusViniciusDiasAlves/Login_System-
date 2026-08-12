require("dotenv").config();

const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conexao.connect((erro) => {

    if (erro) {
        console.error("Erro ao conectar com o banco:", erro);
        return;
    }

    console.log("MySQL conectado com sucesso!");
});

module.exports = conexao;