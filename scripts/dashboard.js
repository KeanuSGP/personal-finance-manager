const exitButton = document.getElementById("exit-button");
const createAccountButton = document.getElementById("create-account-btn");
const dataVisualization = document.getElementById("data-visualization");
const dashboardBody = document.getElementById("dashboard-body")
const modalSaveButton = document.getElementById("save-acc");
const state = JSON.parse(localStorage.getItem("state")) || {};
const inputs = document.getElementById("add-account-modal").getElementsByTagName("input");
const table = document.getElementById("accounts-visualization");
const userBankAccounts = JSON.parse(localStorage.getItem("userBankAccounts")) || {};
const accountsCountP = document.getElementById("accounts-count");
const accNavButtons = document.getElementById("acc-nav-btn");
const modalContainer = document.getElementById("modal-container");
const headers = ["Bank", "Balance", "Limit", "Invoice Due Date"];
const editAcc = document.getElementById("edit-acc");

const accountsCountFunc = (element) => {
    const size = Object.keys(userBankAccounts).length;
    element.textContent = `Você tem ${size} contas criadas.`
    return size;
}
accountsCountFunc(accountsCountP);

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

const clearInputs = (inputs) => {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].length !== 0) {
            inputs[i].value = "";
        }
    }
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

const formatDate = (date) => {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    const formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
    return formattedDate;
}

const checkDate = (date) => {
    const actualDate = new Date();
    actualDate.setHours(0, 0, 0, 0);

    if (date < actualDate) return true
    return actualDate;
}

const correctYearInput = (input) => {
    const day = input.getDate() + 1;
    const month = input.getMonth();
    const year = input.getFullYear();
    const correctYear = new Date(year, month, day)

    return correctYear;
}


const createAccount = () => {
    const bank = document.getElementById("bank-name").value.trim().replace(/\s/, "");
    const balance = document.getElementById("balance").value.trim().replace(/\s/, "");
    const limit = document.getElementById("limit").value.trim().replace(/\s/, "");
    const invoiceDueDate = new Date(document.getElementById("due-date").value.trim().replace(/\s/, ""));

    if (bank.length === 0 || balance.length === 0 || limit.length === 0 || invoiceDueDate === "") {
        alert("Nenhum campo pode estar vazio.")
    } else {
        if (checkDate(correctYearInput(invoiceDueDate)) === true) {
            alert(`A data de vencimento não pode ser menor que ${formatDate(checkDate())}`)
        } else {

            const acc = {
                "bank": bank,
                "balance": parseFloat(balance).toFixed(2),
                "limit": parseFloat(limit).toFixed(2),
                "invoice Due Date": correctYearInput(invoiceDueDate)
            }
            const bankNameLowerCase = bank.toLowerCase();
            const bankAccountsLower = Object.keys(userBankAccounts).map((bank) => bank.toLowerCase());
            if (bankAccountsLower.includes(bankNameLowerCase)) {
                alert("Já existe uma conta com esse nome.")
            } else {
                alert("Conta criada com sucesso!")
                userBankAccounts[bank] = acc;

                localStorage.setItem("userBankAccounts", JSON.stringify(userBankAccounts));
                accountsCountFunc(accountsCountP);

                const modal = document.getElementById("modal-container");
                switchModal(modal);
                showData();
            }
        }
    }
}

exitButton.addEventListener("click", exit);

const getHeaders = () => {
    const headers = Object.keys(Object.values(userBankAccounts)[0]);
    return headers;
}

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
        const keys = Object.keys(el);
        values.forEach((value) => {
            const tableData = document.createElement("td");
            tableData.textContent = value;
            dataRow.appendChild(tableData);
            if (value === el[keys[3]]) {
                tableData.textContent = formatDate(value);
            }

        })
        table.appendChild(dataRow);
        dataRow.addEventListener("click", () => {
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

let tempBankName = "";

const editAccount = (table, inputs) => {
    switchModal(modalContainer);
    const rows = table.childNodes;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].classList.contains("row-styles")) {
            if (rows[i].classList.contains("selected")) {
                const dataValue = rows[i].childNodes;
                tempBankName = dataValue[0].textContent;

                for (let y = 0; y < dataValue.length; y++) {
                    inputs[y].value = dataValue[y].textContent;
                    if (new Date(dataValue[y].textContent)) {
                        inputs[y].value = dataValue[y].textContent.split("/").reverse().join("-");
                    }
                }
            }
        };
    }
}

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
            acc.balance = parseFloat(data[i].value).toFixed(2, "0");
        }

        if (data[i].id === "limit") {
            acc.limit = parseFloat(data[i].value).toFixed(2, "0");
        }

        if (data[i].id === "due-date") {
            if (checkDate(data[i].value) === true) {
                alert(`A data não pode ser menor que ${checkDate()}`)
            } else {
                acc.invoiceDueDate = correctYearInput(new Date(data[i].value));
                // console.log(acc.invoiceDueDate)
            }
        }
    }
    // userBankAccounts[bankName] = acc;
    if (checkDate(acc.invoiceDueDate) === true) {
        alert(`A data não pode ser menor que ${formatDate(checkDate())}`)
    } else {
        // console.log(userBankAccounts[tempBankName])
        delete userBankAccounts[tempBankName];
        userBankAccounts[acc.bank] = acc;
        localStorage.setItem("userBankAccounts", JSON.stringify(userBankAccounts));
        alert("Alterações salvas com sucesso!")
    }


}
const saveEditedAccount = () => {
    createEditedAccount(inputs);
    if (modalContainer.style.display === "flex") {
        modalContainer.style.display = "none"
    }

    if (accNavButtons.style.display === "block") {
        accNavButtons.style.display = "none";
    }
    showData();
}

editAcc.addEventListener("click", () => {
    editAccount(table, inputs);
    modalSaveButton.removeEventListener("click", createAccount)
    modalSaveButton.addEventListener("click", saveEditedAccount);
});

createAccountButton.addEventListener("click", () => {
    modalSaveButton.removeEventListener("click", saveEditedAccount);
    modalSaveButton.addEventListener("click", createAccount);
    clearInputs(inputs);
    switchModal(modalContainer)
    showData();
})

const deleteButton = document.getElementById("delete-acc");

const deleteAccount = (table) => {
    const tableRows = table.childNodes;
    let bankName = "";

    for (let i = 0; i < tableRows.length; i++) {
        if (tableRows[i].classList.contains("selected")) {
            bankName = tableRows[i].childNodes[0].textContent;
        }
    }

    delete userBankAccounts[bankName];
    localStorage.setItem("userBankAccounts", JSON.stringify(userBankAccounts));
    alert("Conta deletada com sucesso!")
    accountsCountFunc(accountsCountP);
}

const confirmText = "Tem certeza que deseja deletar essa conta?";

deleteButton.addEventListener("click", () => {
    if (window.confirm(confirmText)) {
        deleteAccount(table);
        if (accNavButtons.style.display === "block") {
            accNavButtons.style.display = "none";
        }
        showData();
    };

})