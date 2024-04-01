import inquirer from "inquirer";
import { Faker, faker } from "@faker-js/faker";
import chalk from "chalk";

// customer class
class customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobNumber: string;
  accNumber: number;

  constructor(
    fName: string,
    lName: string,
    age: number,
    gen: string,
    mob: string,
    acc: number
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gen;
    this.mobNumber = mob;
    this.accNumber = acc;
  }
}
// interface bankaccount
interface bankAcc {
  accNumber: number;
  balance: number;
}
// class bank
class bank {
  customer: customer[] = [];
  account: bankAcc[] = [];
  addCustomer(obj: customer) {
    this.customer.push(obj);
  }
  addAccountNumber(obj: bankAcc) {
    this.account.push(obj);
  }
  transaction(accObj: bankAcc) {
    let newAccounts = this.account.filter(
      (acc) => acc.accNumber !== accObj.accNumber
    );
    this.account = [...newAccounts, accObj];
  }
}
let myBank = new bank();
//creating customer
for (let i = 1; i <= 3; i++) {
  let fName = faker.person.firstName("male");
  let lName = faker.person.lastName();
  let num = faker.phone.number();
  const cus = new customer(fName, lName, 25 * 1, "male", num, 1000 + i);
  myBank.addCustomer(cus);
  myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
// Bank Functionality

async function bankService(bank: bank) {
  do {
    let service = await inquirer.prompt({
      type: "list",
      name: "select",
      message: "please select a service",
      choices: ["view balance", "cash withdraw", "cash deposit", "exit"],
    });
    // view balance
    if (service.select == "view balance") {
      let res = await inquirer.prompt({
        type: "input",
        name: "number",
        message: "please enter your acc number",
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.number);
      if (!account) {
        console.log(chalk.red.bold.italic("invalid account number"));
      }
      if (account) {
        let name = myBank.customer.find(
          (item) => item.accNumber == account?.accNumber
        );
        console.log(
          ` ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(
            name?.lastName
          )} your account  balance is ${chalk.green.bold(
            `$${account.balance}`
          )}`
        );
      }
    }
    // cash withdraw
    if (service.select == "cash withdraw") {
      let res = await inquirer.prompt({
        type: "input",
        name: "number",
        message: "please enter your acc number",
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.number);
      if (!account) {
        console.log(chalk.red.bold.italic("invalid account number"));
      }
      if (account) {
        let ans = await inquirer.prompt({
          type: "number",
          message: "enter your desired ammount",
          name: "rupee",
        });
        if (ans.rupee > account.balance) {
          console.log(chalk.red.bold("insufficient balance!!"));
        }
        let newBalance = account.balance - ans.rupee;
        // transaction method call
        bank.transaction({ accNumber: account.accNumber, balance: newBalance });
      }
    }
    // cash deposit
    if (service.select == "cash deposit") {
      let res = await inquirer.prompt({
        type: "input",
        name: "number",
        message: "please enter your acc number",
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.number);
      if (!account) {
        console.log(chalk.red.bold.italic("invalid account number"));
      }
      if (account) {
        let ans = await inquirer.prompt({
          type: "number",
          message: "enter your desired ammount",
          name: "rupee",
        });
        let newBalance = account.balance + ans.rupee;
        // transaction method call
        bank.transaction({ accNumber: account.accNumber, balance: newBalance });
      }
    }
    if (service.select == "exit") {
      return;
    }
  } while (true);
}
bankService(myBank);
