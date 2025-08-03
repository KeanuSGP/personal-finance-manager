const exitButton = document.getElementById("exit-button");
const createAccountButton = document.getElementById("create-account-btn");
const dataVisualization = document.getElementById("data-visualization");
const dashboardBody = document.getElementById("dashboard-body")
const modalSaveButton = document.getElementById("save-acc");
const state = JSON.parse(localStorage.getItem("state")) || {};

const userBankAccounts = JSON.parse(localStorage.getItem("userBankAccounts")) || {};

const accountsCount = document.getElementById("accounts-count");
const accountsQuantity = Object.keys(userBankAccounts).length;
accountsCount.textContent = `Voce tem ${accountsQuantity} contas criadas.`
// console.log(userBankAccounts);

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

const switchModal = (modal) => {
    // verifica a propriedade display do modal. Se for "flex" vira none e vice-versa.
    const currentStyle = modal.style.display;

    if (currentStyle === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }

}
const accNavButtons = document.getElementById("acc-nav-btn");

window.addEventListener("click", (e) => {
    if (e.target.id === "show-acc-background" || e.target.id === "modal-container") {
        switchModal(e.target);
    }

    if (e.target.id === "dashboard-body" || e.target.id === "data-visualization") {
        const rows = table.childNodes;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].classList.contains("selected")) {
                rows[i].classList.remove("selected")
                accNavButtons.style.display = "none";
            }
        }
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
            "invoice Due Date": invoiceDueDate
        }
        alert("Conta criada com sucesso!")
        userBankAccounts[bank] = acc;
        localStorage.setItem("userBankAccounts", JSON.stringify(userBankAccounts));
        const modal = document.getElementById("modal-container");
        switchModal(modal);
        showData();
    }
}

modalSaveButton.addEventListener("click", createAccount);
exitButton.addEventListener("click", exit);
const modalContainer = document.getElementById("modal-container");
createAccountButton.addEventListener("click", () => {
    switchModal(modalContainer)
})

const getHeaders = () => {
    const headers = Object.keys(Object.values(userBankAccounts)[0]);
    return headers;
}

const table = document.getElementById("accounts-visualization");
const headers = ["Bank", "Balance", "Limit", "Invoice Due Date"];

const showData = () => {
    table.textContent = "";
    const data = Object.values(userBankAccounts);
    const headerRow = document.createElement("tr");
    const rowHeaders = headers;
    rowHeaders.forEach((header) => {
        const tableHeader = document.createElement("th");
        tableHeader.textContent = header.toUpperCase();
        headerRow.appendChild(tableHeader);
    })
    table.appendChild(headerRow);

    data.forEach((el) => {
        const dataRow = document.createElement("tr");
        dataRow.classList.add("row-styles")
        const values = Object.values(el);
        values.forEach((value) => {
            const tableData = document.createElement("td");
            tableData.textContent = value;
            dataRow.appendChild(tableData);
        })
        table.appendChild(dataRow);
        dataRow.addEventListener("click", () => {
            // console.log(dataRow.childNodes[0].textContent)
            dataRow.classList.toggle("selected");
            const rows = table.childNodes;
            for (let i = 0; i < rows.length; i++) {
                if (dataRow.classList.contains("selected")) {
                    accNavButtons.style.display = "block";
                    if (dataRow !== rows[i]) {
                        rows[i].classList.remove("selected");
                    }
                } else {
                    accNavButtons.style.display = "none";
                }
            }
        })
    })
}

window.onload = showData;

const editAcc = document.getElementById("edit-acc");
let tempBankName = "";

const editAccount = (table) => {
    switchModal(modalContainer);
    const inputs = document.getElementById("add-account-modal").getElementsByTagName("input");
    const rows = table.childNodes;
    
    modalSaveButton.removeEventListener("click", createAccount);

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].classList.contains("row-styles")) {
            if (rows[i].classList.contains("selected")) {
                const dataValue = rows[i].childNodes;
                tempBankName = dataValue[0].textContent;
                for (let y = 0; y < dataValue.length; y++) {
                    inputs[y].value = dataValue[y].textContent;
                }
            }
        };
    }
}

editAcc.addEventListener("click", () => {
    editAccount(table);
});

const createEditedAccount = (data) => {
    
    let acc = {
        "bank": "",
        "balance": "",
        "limit": "",
        "invoiceDueDate": ""
    };
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === "bank-name") {
            acc.bank = data[i].value;
        }

        if (data[i].id === "balance") {
            acc.balance = data[i].value;
        }

        if (data[i].id === "limit") {
            acc.limit = data[i].value;
        }

        if (data[i].id === "due-date") {
            acc.invoiceDueDate = data[i].value;
        }
    }
    // userBankAccounts[bankName] = acc;
    delete userBankAccounts[tempBankName];
    userBankAccounts[acc.bank] = acc;
    // console.log(acc)
    localStorage.setItem("userBankAccounts", JSON.stringify(userBankAccounts));
}

modalSaveButton.removeEventListener("click", createAccount);
const saveEditedAccount = () => {
    const inputs = document.getElementById("add-account-modal").getElementsByTagName("input");
    // console.log(inputs[0].value)
    createEditedAccount(inputs);
    alert("Alterações salvas com sucesso!")
    if (modalContainer.style.display === "flex") {
        modalContainer.style.display = "none"
    }
    showData();
}
modalSaveButton.addEventListener("click", saveEditedAccount);

const deleteAccount = () => {

}