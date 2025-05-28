//BANKING APPLICATION

//Features:

// 1. Customer Registration
// 2. Customer Login
// 3. Account Creation
// 4. Deposit Money
// 5. Withdraw Money
// 6. Transfer Money
// 7. View Transactions
// 8. Change PIN
// 9. View Balance
// 10. Close Account
// 11.Change Password

let app = {
  start: function () {
    app.Bank.loadCustomers();
    console.log(`Welcome to the app.`);
    const userDecision = prompt(
      "What would you like to do?\n1. Login\n2. Create an account"
    );

    if (userDecision === "1") {
      const customer = app.Bank.authenticateCustomer();
      if (customer) {
        console.log(`Welcome, ${customer.name}!`);
        app.customerMenu(customer);
      } else {
        console.log("Login failed.")
      }
    } else if (userDecision === "2") {
      const customer = app.createCustomer();
      app.customerMenu(customer);
    } else {
      throw new Error("Invalid command");
    }
  },

  customerMenu: function (customer) {
    let running = true;
    while (running) {
      const choice = prompt(
      `Choose an action:
      1. Deposit Money
      2. Withdraw Money
      3. Transfer Money
      4. View Balance
      5. View Transactions
      6. Exit`
      );
      switch (choice) {
        case "1": {
          const accNum = prompt("Enter your account number:");
          customer.depositMoney(accNum);
          break;
        }
        case "2": {
          const accNum = prompt("Enter your account number:");
          customer.withdrawMoney(accNum);
          break;
        }
        case "3": {
          const fromAcc = prompt("Enter your account number:");
          const toAcc = prompt("Enter recipient account number:");
          const recipientUsername = prompt("Enter recipient username:");
          customer.transferMoney(fromAcc, toAcc, recipientUsername);
          break;
        }
        case "4": {
          const accNum = prompt("Enter account number to check balance:");
          const acc = customer.getAccount(accNum);
          if (acc) {
            alert(`Balance: ₦${acc.getBalance()}`);
          } else {
            alert("Account not found.");
          }
          break;
        }
        case "5": {
          const accNum = prompt("Enter account number to view transactions:");
          const acc = customer.getAccount(accNum);
          if (acc) {
            const txns = acc.getTransactions();
            if (txns.length === 0) {
              alert("No transactions.");
            } else {
              txns.forEach((t, i) => {
                console.log(
                  `${i + 1}. ${t.type} ₦${t.amount} - ${t.status} - ${
                    t.details
                  } - ${t.date}`
                );
              });
            }
          } else {
            alert("Account not found.");
          }
          break;
        }
        case "6":
          running = false;
          alert("Thank you for using the bank app.");
          break;
        default:
          alert("Invalid choice.");
      }
    }
  },
  //(username, password, name, address, dob, phone, email)
  createCustomer: function () {
    const fullname = prompt("Enter your full name:");
    const username = prompt("Enter a username:");
    const password = prompt("Enter a password:");
    const address = prompt("Enter your address:");
    const dob = prompt("Enter your date of birth (YYYY-MM-DD):");
    const phone = prompt("Enter your phone number:");
    const email = prompt("Enter your email address:");

    const customer = app.Bank.createCustomer(
      username,
      password,
      fullname,
      address,
      dob,
      phone,
      email
    );
    console.log("Customer created successfully!");
    return customer;
  },
  // Account Object Blueprint
  Account: function (type, pin) {
    this.pin = pin;
    this.balance = 0;
    this.transactions = [];

    this.number = number;
    this.type = type; // "savings" or "current"
    this.dateCreated = new Date();

    this.deposit = function (amount) {
      if (amount <= 0) throw new Error("Invalid amount.");
      this.balance = this.balance + amount;
      this.addTransaction("deposit", amount, "success", "made a deposit");
      return this.balance;
    };

    this.withdraw = function (amount) {
      if (amount <= 0) throw new Error("Invalid amount.");
      if (amount > this.balance) {
        throw new Error("Insufficient funds.");
      }
      this.balance = this.balance - amount;
      this.addTransaction("withdraw", amount, "success", "made a withdrawal");
      return this.balance;
    };

    this.transfer = function (amount, targetAccount) {
      this.withdraw(amount);
      targetAccount.deposit(amount);
      this.addTransaction(
        "transfer",
        amount,
        "success",
        `To: ${targetAccount.number}`
      );
    };

    this.checkPin = function (pin) {
      return this.pin === pin;
    };

    this.setPin = function (newPin) {
      this.pin = newPin;
    };

    this.getBalance = function () {
      return this.balance;
    };

    this.getTransactions = function () {
      return this.transactions;
    };

    this.addTransaction = function (type, amount, status, details) {
      this.transactions.push(new Transaction(type, amount, status, details));
    };
  },

  // Transaction Object
  Transaction: function (type, amount, status, details) {
    this.type = type;
    this.amount = amount;
    this.status = status;
    this.details = details;
    this.date = new Date();
  },

  // Customer Object Blueprint
  Customer: function (username, password, name, address, dob, phone, email) {
    this.password = password;
    this.accounts = [];

    this.username = username;
    this.name = name;
    this.address = address;
    this.dob = dob;
    this.phone = phone;
    this.email = email;

    this.verifyPassword = function (password) {
      return this.password === password;
    };

    this.updatePassword = function (oldPassword, newPassword) {
      if (!verifyPassword(oldPassword)) {
        console.log("Old password don't match.");
        return;
      }
      //else update the password.
      this.password = newPassword;
    };

    this.addAccount = function (account) {
      this.accounts.push(account);
    };

    this.getAccount = function (accountNumber) {
      return this.accounts.find((acc) => acc.number === accountNumber);
    };

    this.getAccounts = function () {
      return this.accounts;
    };

    //Deposit Money
    this.depositMoney = function (accountNo) {
      console.log("DepositMoney started");
      let amount = parseFloat(prompt("Enter amount to deposit:"));
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount.");
        return;
      }
      let account = this.getAccount(accountNo);
      if (!account) {
        console.log("Account not found.");
        return;
      }
      let pin = prompt("Enter your account PIN:");
      if (!account.checkPin(pin)) {
        alert("Incorrect PIN.");
        return;
      }

      account.deposit(amount);
      Bank.saveCustomers();
      alert(`Deposit successful. New balance: ₦${account.getBalance()}`);
      app.Bank.saveCustomers();
    };

    //Withdraw Money
    this.withdrawMoney = function (accountNo) {
      const account = this.getAccount(accountNo);
      if (!account) {
        console.log("Account not found.");
        return;
      }

      const amount = parseFloat(prompt("Enter amount to withdraw:"));
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount.");
        return;
      }

      const pin = prompt("Enter your account PIN:");
      if (!account.checkPin(pin)) {
        console.log("Invalid PIN.");
        return;
      }

      try {
        account.withdraw(amount);
        console.log(
          `Withdrawal successful. New balance: ₦${account.getBalance()}`
        );
        app.Bank.saveCustomers();
      } catch (err) {
        console.log(err.message);
      }
    };

    //Transfer Money
    this.transferMoney = function (fromAccountNo, toAccountNo, targetUsername) {
      const fromAccount = this.getAccount(fromAccountNo);
      if (!fromAccount) {
        console.log("Your source account not found.");
        return;
      }

      const targetCustomer = app.Bank.findCustomer(targetUsername);
      if (!targetCustomer) {
        console.log("Target customer not found.");
        return;
      }

      const toAccount = targetCustomer.getAccount(toAccountNo);
      if (!toAccount) {
        console.log("Target account not found.");
        return;
      }

      const amount = parseFloat(prompt("Enter amount to transfer:"));
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount.");
        return;
      }

      const pin = prompt("Enter your account PIN:");
      if (!fromAccount.checkPin(pin)) {
        console.log("Invalid PIN.");
        return;
      }

      try {
        fromAccount.transfer(amount, toAccount);
        console.log("Transfer successful.");
        app.Bank.saveCustomers();
      } catch (err) {
        console.log(err.message);
      }
    };
  },

  // Bank Object Blueprint
  Bank: {
    customers: [],
    staff: [{ username: "admin", password: "admin123" }],

    createCustomer: function (
      username,
      password,
      name,
      address,
      dob,
      phone,
      email
    ) {
      if (this.customers.find((c) => c.username === username))
        throw new Error("Username exists.");
      const customer = new app.Customer(
        username,
        password,
        name,
        address,
        dob,
        phone,
        email
      );
      this.customers.push(customer);
      this.saveCustomers();
      return customer;
    },

    findCustomer: function (username) {
      return this.customers.find((c) => c.username === username);
    },

    authenticateCustomer: function () {
      const username = prompt("Enter your username");
      const password = prompt("Enter your password");
      const customer = this.findCustomer(username);
      if (customer && customer.verifyPassword(password) === true)
        return customer;
      return null;
    },

    authenticateStaff: function (username, password) {
      return this.staff.some(
        (staff) => staff.username === username && staff.password === password
      );
    },

    listAllCustomers: function () {
      return this.customers.map((c) => c.username);
    },

    saveCustomers: function () {
      localStorage.setItem("bankCustomers", JSON.stringify(this.customers));
    },

    loadCustomers: function () {
      const data = localStorage.getItem("bankCustomers");
      if (data) {
        const rawCustomers = JSON.parse(data);
        this.customers = rawCustomers.map((c) => {
          const customer = new app.Customer(
            c.username,
            c.password,
            c.name,
            c.address,
            c.dob,
            c.phone,
            c.email
          );
          // Rehydrate accounts
          if (Array.isArray(c.accounts)) {
            c.accounts.forEach((acc) => {
              const account = new app.Account(acc.number, acc.type, acc.pin);
              account.balance = acc.balance;
              account.transactions = acc.transactions || [];
              customer.addAccount(account);
            });
          }
          return customer;
        });
      }
    },
  },
};

app.start();
