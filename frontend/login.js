function meuEmail() {

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

        console.log(dados);

        if (dados.sucesso) {

            localStorage.setItem("token", dados.token);

            alert(dados.mensagem);

        } else {

            alert(dados.mensagem);
        }
    })
    .catch(erro => {

        console.log("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");

    });
}


function chamarCadastro() {

    document.getElementById("cadastramentoDiv").style.display = "block";

}


function cadastrarDados() {

    let nome = document.getElementById("nomeCadastrado").value;
    let email = document.getElementById("emailCadastro").value;
    let senha = document.getElementById("senhaCadastrada").value;

    fetch("http://localhost:3000/cadastro", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {

        console.log(dados);

        alert(dados.mensagem);

    })
    .catch(erro => {

        console.log("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");

    });
}


function acessarPerfil() {

    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/perfil", {
        method: "GET",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(resposta => resposta.json())
    .then(dados => {

        console.log(dados);

    })
    .catch(erro => {

        console.log("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");

    });
}