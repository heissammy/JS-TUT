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
    const userDecision = prompt("What would you like to do?\n1. Login\n2. Create an account");

    if (userDecision === "1") {
      const customer = app.Bank.authenticateCustomer();
      console.log(`Welcome, ${customer.name}!`);
    } else if (userDecision === "2") {
      app.createCustomer();
    } else {
      throw new Error("Invalid command");
    }
  },
  //(username, password, name, address, dob, phone, email
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

    this.depositMoney = function (accountNo) {
      let amount = parseFloat(prompt("Enter amount to deposit:"));
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount.");
        return;
      }
      //Todo; first find the account
      let account = this.getAccount(accountNo);
      if (!account) {
        console.log(`Invalid account number.`);
        return;
      }
      account.deposit(amount);
      Bank.saveCustomers();
      alert(`Deposit successful. New balance: ₦${account.getBalance()}`);
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
      const customer = new Customer(
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
              const account = new app.Account(
                acc.number,
                acc.type,
                acc.pin
              );
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
