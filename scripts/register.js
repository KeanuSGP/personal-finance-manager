const createAccBtn = document.getElementById("register-button");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

const createAccount = () => {
    const username = usernameInput.value.trim().replace(" ", "");
    const password = passwordInput.value.trim().replace(" ", "");
    const user = [];

    if (username.length === 0 || password.length === 0) {
        alert("Por favor, preencha todos os campos.")
    } else {
        user.push(username, password);
        if (accounts.length === 0) {
            accounts.push(user);
            alert("Conta criada com sucesso!")
        } else {
            let check = false;
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i][0] === user[0]) {
                    check = true;
                } else {
                    check = false
                }
            }
            if (check) {
                alert("O usuário já existe!")
            } else {
                accounts.push(user);
                alert("Conta criada com sucesso!")
            }
        }

    }

    localStorage.setItem("accounts", JSON.stringify(accounts));

    console.log('Array atualizado: ', accounts);
}

createAccBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createAccount();
})
