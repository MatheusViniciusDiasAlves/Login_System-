const send = require("send");

function meuEmail(){

    let email = document.getElementById("login").value;
    let password = document.getElementById("senha").value;

    fetch("http://localhost:3000/login", {
        method: "POST", 

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {
        console.log(dados)
    })
}