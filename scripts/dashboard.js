const exitButton = document.getElementById("exit-button");
const createAccountButton = document.getElementById("create-account-btn");
const dataVisualization = document.getElementById("data-visualization");
const dashboardBody = document.getElementById("dashboard-body")
const modalSaveButton = document.getElementById("save-acc");
const state = JSON.parse(localStorage.getItem("state")) || {};

if (!state.logged === true || state.length === 0) {
    exitButton.style.display = "none";
    const navButtons = document.getElementById("buttons-div");
    const loginAndRegisterButtons = document.getElementById("login-Register");

    navButtons.style.display = "none";
    loginAndRegisterButtons.style.display = "block";

    dataVisualization.textContent = "Nenhum usuário logado. Favor, logar ou criar conta."

}



const exit = () => {
    alert("Usuário deslogado.")
    localStorage.setItem("state", JSON.stringify({ "logged": false }))
    window.location.href = "./login.html";
}

const showModal = () => {
    const modal = document.getElementById("modal-container");
    modal.style.display = "flex";
}

const switchModal = (modal) => {
    const currentStyle = modal.style.display;

    if (currentStyle === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-container");
    if (e.target === modal) {
        switchModal(modal);
    }
})

const createAccount = () => {
    const bank = document.getElementById("bank-name").value.trim().replace(/\s/, "");
    const balance = document.getElementById("balance").value.trim().replace(/\s/, "");
    const limit = document.getElementById("limit").value.trim().replace(/\s/, "");
    const invoiceDueDate = document.getElementById("due-date").value.trim().replace(/\s/, "");

    if (bank.length === 0 || balance.length === 0 || limit.length === 0 || invoiceDueDate === "") {
        alert("Nenhum campo pode estar vazio.")
    } else {
        const acc = {
            "bank": bank,
            "balance": balance,
            "limit": limit,
            "invoiceDueDate": invoiceDueDate
        }


        const userBankAccounts = JSON.parse(localStorage.getItem("userBankAccounts")) || {};
        userBankAccounts[bank] = acc;
        localStorage.setItem("userBankAccounts", JSON.stringify(userBankAccounts));
    }



}



modalSaveButton.addEventListener("click", createAccount);
exitButton.addEventListener("click", exit);
createAccountButton.addEventListener("click", showModal)