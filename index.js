// modulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");

// modulos internos

const fs = require("fs");
const { PassThrough } = require("stream");

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        messagem: "o que voce deseja fazer",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (aciont === "Criar Conta") {
        createAccount();
      } else if (aciont === "Depositar") {
        deposit();
      } else if (aciont === "Consultar saldo") {
        getAccountBalance();
      } else if (aciont === "Sacar") {
        withdraw();
      } else if (aciont === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

// create an account

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para a sua conta",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      console.info(accountName);
      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }
      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      }
      fs.writeFileSync(
        `accounts/${accountName}.json`,
        `{"balance": 0}`,
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Parabéns, sua conta foi criada!"));
    })
    .catch((err) => console.log(err));
}

//add an amount to user account

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      //verify if account exists
      if (!checkAccount(accountName)) {
        return deposit();
      }
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quando voce deseja depositar",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          //add an amount
          addAmount(accountName, accountName);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const account = getAccount(accountName);
  if (!amount) {
    console.log(chalk.bgRed.bkack("Ocorreu um erro, tente mais tarde!"));
    return deposit();
  }
  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(`Foi depositado um valor de R$${amount} na sua conta!`)
  );
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
}

//shouw account balance

function getAccountBalance() {
  inquirer([
    {
      name: "accountName",
      message: "Qual  nome da sua conta?",
    },
  ])
    .then((answer) => {
      const accountName = ["accountName"];
      //verify if account exists
      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }
      const accountData = getAccountBalance(accountName);
      console.log(
        chalk.bgBlue.black(
          `Ola o salda da sua conta é de R$${accountData.balance}`
        )
      ),
        operation();
    })
    .catch((err) => console.log(err));
}

// withdraw an amount from user account
function withdraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual  nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return withdraw();
      }
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto voce deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];
          removeAmount(accountName, amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novemente mais tarde!")
    );
    return withdraw();
  }
  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black("Valor indisponivel"));
    return withdraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`)
  );
  return operation();
}
