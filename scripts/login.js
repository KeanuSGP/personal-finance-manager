const loginButton = document.getElementById("login-button");
const accounts = JSON.parse(localStorage.getItem("accounts")) || [];


const login = () => {
    const username = document.getElementById("login-username-input").value.trim().replace(" ", "");
    const password = document.getElementById("login-password-input").value.trim().replace(" ", "");
    const user = [];

    if (accounts.length === 0) {
        alert("Conta não encontrada.")
    } else {
        if (username.length === 0 || password.length === 0) {
            alert("Preencha todos os campos.")
        } else {
            user.push(username, password);
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i][0].toLowerCase() !== user[0].toLowerCase()) {
                    alert("Conta não encontrada.")
                } else {
                    if (accounts[i][1] !== user[1]) {
                        alert("Senha errada, tente novamente.")
                    } else {
                        alert("Usuário logado com sucesso!")
                        localStorage.setItem("state", JSON.stringify({ "logged": true }));
                        window.location.href = "./dashboard.html";
                    }
                }
            }
        }
    }

    // if (accounts.length === 0) {
    //     alert("Conta não encontrada.")
    // }

    // console.log(accounts)
}

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    login();
})