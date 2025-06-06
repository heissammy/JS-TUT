import Customer from "./models/Customer.js";
import Account from "./models/Account.js";
import Transaction from "./models/Transaction.js";

// Features in this banking app:
// - Register new user
// - Login for user
// - Create account (savings/current)
// - Deposit money
// - Withdraw money
// - Transfer money to another user
// - View all transactions for account
// - Change PIN for account
// - Check account balance
// - Close (deactivate) account
// - Change password
// - View profile info
// - Update profile info
// - List all your accounts
// - Reactivate account (if closed)
// - Freeze/unfreeze account
// - Logout
// - Staff login (admin)
// - Staff: list all customers
// - Staff: reactivate/freeze/unfreeze customer account

let app = {
  Bank: {
    customers: [], // this is where we keep all the customers
    staff: [{ username: "admin", password: "admin123" }], // just one staff for now
    saveCustomers: function () {
      // save all customers to local storage so we dont lose them
      localStorage.setItem("bankCustomers", JSON.stringify(this.customers));
    },
    loadCustomers: function () {
      // get customers from local storage if there is any
      const data = localStorage.getItem("bankCustomers");
      if (data) {
        const rawCustomers = JSON.parse(data);
        this.customers = [];
        for (let i = 0; i < rawCustomers.length; i++) {
          let c = rawCustomers[i];
          let customer = new Customer(
            c.username,
            c.password,
            c.name,
            c.address,
            c.dob,
            c.phone,
            c.email
          );
          // add all accounts for this customer
          if (Array.isArray(c.accounts)) {
            for (let j = 0; j < c.accounts.length; j++) {
              let acc = c.accounts[j];
              let account = new Account(acc.number, acc.type, acc.pin);
              account.balance = acc.balance;
              account.transactions = acc.transactions || [];
              account.active = acc.active !== false;
              account.frozen = acc.frozen === true;
              customer.addAccount(account);
            }
          }
          this.customers.push(customer);
        }
      }
    },
    createCustomer: function (
      username,
      password,
      name,
      address,
      dob,
      phone,
      email
    ) {
      // check if username is already used
      for (let i = 0; i < this.customers.length; i++) {
        if (this.customers[i].username === username) {
          throw new Error("Username exists.");
        }
      }
      // make new customer
      let customer = new Customer(
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
      // look for a customer by username
      for (let i = 0; i < this.customers.length; i++) {
        if (this.customers[i].username === username) {
          return this.customers[i];
        }
      }
      return null;
    },
    authenticateCustomer: function () {
      // ask for username and password to login
      let username = prompt("Enter your username");
      if(Customer.validateUsername(username) === false) {
        throw new Error("Invalid username.");
      }
      let password = prompt("Enter your password");
      let customer = this.findCustomer(username);
      if (customer && customer.verifyPassword(password)) {
        return customer;
      }
      throw new Error("Authentication failed.");
    },
    authenticateStaff: function () {
      // staff login, only for admin stuff
      let username = prompt("Enter staff username:");
      let password = prompt("Enter staff password:");
      for (let i = 0; i < this.staff.length; i++) {
        if (
          this.staff[i].username === username &&
          this.staff[i].password === password
        ) {
          return this.staff[i];
        }
      }
      throw new Error("Staff authentication failed.");
    },
    listAllCustomers: function () {
      // show all customers in the bank
      if (this.customers.length === 0) {
        alert("No customers found.");
        return;
      }
      for (let i = 0; i < this.customers.length; i++) {
        let c = this.customers[i];
        console.log(i + 1 + ". " + c.username + " - " + c.name);
      }
    },
  },


  start: function () {
    // this is where the app starts
    this.Bank.loadCustomers();
    let running = true;
    while (running) {
      let mainChoice = prompt(
        "Welcome to Console Bank!\nChoose an option:\n1. Register\n2. Login\n3. Staff Login\n4. Exit"
      );
      try {
        if (mainChoice === "1") {
          this.registerCustomer();
        } else if (mainChoice === "2") {
          let customer = this.Bank.authenticateCustomer();
          this.customerMenu(customer);
        } else if (mainChoice === "3") {
          this.staffMenu();
        } else if (mainChoice === "4") {
          running = false;
          alert("Thank you for using Console Bank!");
        } else if (mainChoice === null) {
          running = false;
          alert("Thank you for using Console Bank!");
        } else {
          alert("Invalid choice.");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  },

  registerCustomer: function () {
    // make a new customer
    let name = prompt("Enter your full name:");
    if (name === null) return; // cancel
    let username = prompt("Choose a username:");
    if (username === null) return;
    if (!Customer.validateUsername(username)) {
      alert("Invalid username.");
      return;
    }
    let password = prompt("Choose a password:");
    if (password === null) return;
    if (!Customer.validatePassword(password)) {
      alert("Invalid password.");
      return;
    }
    let address = prompt("Enter your address:");
    if (address === null) return;
    let dob = prompt("Enter your date of birth (YYYY-MM-DD):");
    if (dob === null) return;
    let phone = prompt("Enter your phone number:");
    if (phone === null) return;
    let email = prompt("Enter your email address:");
    if (email === null) return;

    // Prompt for first account creation
    let type = prompt(
      "Create your first account. Enter account type (savings/current):"
    );
    if (type === null) return;
    if (type !== "savings" && type !== "current") {
      alert("Invalid account type.");
      return;
    }
    let pin = prompt("Set a 4-digit PIN for your account:");
    if (pin === null) return;
    if (!Account.validatePin(pin)) {
      alert("Invalid PIN. Must be 4 digits.");
      return;
    }
    let number = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    try {
      let customer = this.Bank.createCustomer(
        username,
        password,
        name,
        address,
        dob,
        phone,
        email
      );
      let account = new Account(number, type, pin);
      customer.addAccount(account);
      this.Bank.saveCustomers();
      alert(
        "Registration successful! Your first account number is: " +
          number +
          "\nYou can now log in."
      );
    } catch (err) {
      alert(err.message);
    }
  },

  customerMenu: function (customer) {
    let loggedIn = true;
    while (loggedIn) {
      let choice = prompt(
        "Welcome, " +
          customer.name +
          "!\nChoose an action:\n1. Create Account\n2. Deposit Money\n3. Withdraw Money\n4. Transfer Money\n5. View Transactions\n6. Change PIN\n7. View Balance\n8. Close Account\n9. Change Password\n10. View Profile\n11. Update Profile\n12. List My Accounts\n13. Reactivate Account\n14. Freeze Account\n15. Unfreeze Account\n16. Logout"
      );
      if (choice === null) return; // cancel returns to main menu
      try {
        if (choice === "1") {
          this.createAccount(customer);
        } else if (choice === "2") {
          let accNum = prompt("Enter your account number:");
          if (accNum === null) return;
          let acc = customer.getAccount(accNum);
          if (!acc) throw new Error("Account not found.");
          let pin = prompt("Enter your account PIN:");
          if (pin === null) return;
          if (!acc.checkPin(pin)) throw new Error("Incorrect PIN.");
          let amountStr = prompt("Enter amount to deposit:");
          if (amountStr === null) return;
          let amount = parseFloat(amountStr);
          if (!Account.validateAmount(amount))
            throw new Error("Invalid amount.");
          acc.deposit(amount);
          this.Bank.saveCustomers();
          alert("Deposit successful. New balance: ₦" + acc.getBalance());
        } else if (choice === "3") {
          let accNum = prompt("Enter your account number:");
          if (accNum === null) return;
          let acc = customer.getAccount(accNum);
          if (!acc) throw new Error("Account not found.");
          let pin = prompt("Enter your account PIN:");
          if (pin === null) return;
          if (!acc.checkPin(pin)) throw new Error("Incorrect PIN.");
          let amountStr = prompt("Enter amount to withdraw:");
          if (amountStr === null) return;
          let amount = parseFloat(amountStr);
          if (!Account.validateAmount(amount))
            throw new Error("Invalid amount.");
          acc.withdraw(amount);
          this.Bank.saveCustomers();
          alert("Withdrawal successful. New balance: ₦" + acc.getBalance());
        } else if (choice === "4") {
          let fromAccNum = prompt("Enter your account number:");
          if (fromAccNum === null) return;
          let fromAcc = customer.getAccount(fromAccNum);
          if (!fromAcc) throw new Error("Your account not found.");
          let pin = prompt("Enter your account PIN:");
          if (pin === null) return;
          if (!fromAcc.checkPin(pin)) throw new Error("Incorrect PIN.");
          let toUsername = prompt("Enter recipient username:");
          if (toUsername === null) return;
          let toCustomer = this.Bank.findCustomer(toUsername);
          if (!toCustomer) throw new Error("Recipient not found.");
          let toAccNum = prompt("Enter recipient account number:");
          if (toAccNum === null) return;
          let toAcc = toCustomer.getAccount(toAccNum);
          if (!toAcc) throw new Error("Recipient account not found.");
          let amountStr = prompt("Enter amount to transfer:");
          if (amountStr === null) return;
          let amount = parseFloat(amountStr);
          if (!Account.validateAmount(amount))
            throw new Error("Invalid amount.");
          fromAcc.transfer(amount, toAcc);
          this.Bank.saveCustomers();
          alert("Transfer successful.");
        } else if (choice === "5") {
          let accNum = prompt("Enter your account number:");
          if (accNum === null) return;
          let acc = customer.getAccount(accNum);
          if (!acc) throw new Error("Account not found.");
          let txns = acc.getTransactions();
          if (txns.length === 0) {
            alert("No transactions.");
          } else {
            for (let i = 0; i < txns.length; i++) {
              let t = txns[i];
              console.log(
                i +
                  1 +
                  ". " +
                  t.type +
                  " ₦" +
                  t.amount +
                  " - " +
                  t.status +
                  " - " +
                  t.details +
                  " - " +
                  t.date
              );
            }
          }
        } else if (choice === "6") {
          let accNum = prompt("Enter your account number:");
          if (accNum === null) return;
          let acc = customer.getAccount(accNum);
          if (!acc) throw new Error("Account not found.");
          let oldPin = prompt("Enter old PIN:");
          if (oldPin === null) return;
          if (!acc.checkPin(oldPin)) throw new Error("Incorrect old PIN.");
          let newPin = prompt("Enter new PIN:");
          if (newPin === null) return;
          if (!Account.validatePin(newPin))
            throw new Error("Invalid PIN. Must be 4 digits.");
          acc.setPin(newPin);
          this.Bank.saveCustomers();
          alert("PIN changed.");
        } else if (choice === "7") {
          let accNum = prompt("Enter your account number:");
          if (accNum === null) return;
          let acc = customer.getAccount(accNum);
          if (!acc) throw new Error("Account not found.");
          alert("Balance: ₦" + acc.getBalance());
        } else if (choice === "8") {
          let accNum = prompt("Enter your account number to close:");
          if (accNum === null) return;
          customer.closeAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "9") {
          customer.changePassword();
          this.Bank.saveCustomers();
        } else if (choice === "10") {
          customer.viewProfile();
        } else if (choice === "11") {
          customer.updateProfile();
          this.Bank.saveCustomers();
        } else if (choice === "12") {
          customer.listAccounts();
        } else if (choice === "13") {
          let accNum = prompt("Enter your account number to reactivate:");
          if (accNum === null) return;
          customer.reactivateAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "14") {
          let accNum = prompt("Enter your account number to freeze:");
          if (accNum === null) return;
          customer.freezeAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "15") {
          let accNum = prompt("Enter your account number to unfreeze:");
          if (accNum === null) return;
          customer.unfreezeAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "16") {
          loggedIn = false;
          alert("Logged out.");
        } else {
          alert("Invalid choice.");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  },

  createAccount: function (customer) {
    let type = prompt("Enter account type (savings/current):");
    if (type === null) return;
    if (type !== "savings" && type !== "current") {
      alert("Invalid account type.");
      return;
    }
    let pin = prompt("Set a 4-digit PIN:");
    if (pin === null) return;
    if (!Account.validatePin(pin)) {
      alert("Invalid PIN. Must be 4 digits.");
      return;
    }
    let number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    let account = new Account(number, type, pin);
    customer.addAccount(account);
    this.Bank.saveCustomers();
    alert("Account created! Number: " + number);
  },

  staffMenu: function () {
    try {
      this.Bank.authenticateStaff();
      let running = true;
      while (running) {
        let choice = prompt(
          "Staff Menu:\n1. List All Customers\n2. Reactivate Customer Account\n3. Freeze Customer Account\n4. Unfreeze Customer Account\n5. Exit Staff Menu"
        );
        if (choice === null) return;
        if (choice === "1") {
          this.Bank.listAllCustomers();
        } else if (choice === "2") {
          let username = prompt("Enter customer username:");
          if (username === null) return;
          let customer = this.Bank.findCustomer(username);
          if (!customer) throw new Error("Customer not found.");
          let accNum = prompt("Enter account number to reactivate:");
          if (accNum === null) return;
          customer.reactivateAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "3") {
          let username = prompt("Enter customer username:");
          if (username === null) return;
          let customer = this.Bank.findCustomer(username);
          if (!customer) throw new Error("Customer not found.");
          let accNum = prompt("Enter account number to freeze:");
          if (accNum === null) return;
          customer.freezeAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "4") {
          let username = prompt("Enter customer username:");
          if (username === null) return;
          let customer = this.Bank.findCustomer(username);
          if (!customer) throw new Error("Customer not found.");
          let accNum = prompt("Enter account number to unfreeze:");
          if (accNum === null) return;
          customer.unfreezeAccount(accNum);
          this.Bank.saveCustomers();
        } else if (choice === "5") {
          running = false;
        } else {
          alert("Invalid choice.");
        }
      }
    } catch (err) {
      alert(err.message);
    }
  },
};

app.start();
