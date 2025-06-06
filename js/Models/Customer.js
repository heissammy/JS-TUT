// Customer model for Console Bank

export default function Customer(
  username,
  password,
  name,
  address,
  dob,
  phone,
  email
) {
  this.username = username;
  this.password = password;
  this.name = name;
  this.address = address;
  this.dob = dob;
  this.phone = phone;
  this.email = email;
  this.accounts = [];

  this.verifyPassword = function (password) {
    return this.password === password;
  };
  this.addAccount = function (account) {
    this.accounts.push(account);
  };
  this.getAccount = function (accountNumber) {
    return this.accounts.find((acc) => acc.number === accountNumber) || null;
  };
  this.listAccounts = function () {
    if (this.accounts.length === 0) {
      alert("No accounts found.");
      return;
    }
    for (let i = 0; i < this.accounts.length; i++) {
      let acc = this.accounts[i];
      console.log(
        i +
          1 +
          ". " +
          acc.type +
          " - " +
          acc.number +
          " - Balance: ₦" +
          acc.balance +
          " - Active: " +
          (acc.active !== false) +
          " - Frozen: " +
          (acc.frozen === true)
      );
    }
  };
  this.viewProfile = function () {
    alert(
      "Name: " +
        this.name +
        "\nUsername: " +
        this.username +
        "\nAddress: " +
        this.address +
        "\nDOB: " +
        this.dob +
        "\nPhone: " +
        this.phone +
        "\nEmail: " +
        this.email
    );
  };
  this.updateProfile = function () {
    let newName = prompt("Update name [" + this.name + "]:", this.name);
    if (newName === null) return;
    if (newName) this.name = newName;
    let newAddress = prompt(
      "Update address [" + this.address + "]:",
      this.address
    );
    if (newAddress === null) return;
    if (newAddress) this.address = newAddress;
    let newDob = prompt("Update DOB [" + this.dob + "]:", this.dob);
    if (newDob === null) return;
    if (newDob) this.dob = newDob;
    let newPhone = prompt("Update phone [" + this.phone + "]:", this.phone);
    if (newPhone === null) return;
    if (newPhone) this.phone = newPhone;
    let newEmail = prompt("Update email [" + this.email + "]:", this.email);
    if (newEmail === null) return;
    if (newEmail) this.email = newEmail;
    alert("Profile updated.");
  };
  this.closeAccount = function (accountNumber) {
    let acc = this.getAccount(accountNumber);
    if (!acc) throw new Error("Account not found.");
    acc.active = false;
    alert("Account closed (deactivated). Contact staff to reactivate.");
  };
  this.reactivateAccount = function (accountNumber) {
    let acc = this.getAccount(accountNumber);
    if (!acc) throw new Error("Account not found.");
    acc.active = true;
    alert("Account reactivated.");
  };
  this.freezeAccount = function (accountNumber) {
    let acc = this.getAccount(accountNumber);
    if (!acc) throw new Error("Account not found.");
    acc.frozen = true;
    alert("Account frozen.");
  };
  this.unfreezeAccount = function (accountNumber) {
    let acc = this.getAccount(accountNumber);
    if (!acc) throw new Error("Account not found.");
    acc.frozen = false;
    alert("Account unfrozen.");
  };
  this.changePassword = function () {
    let oldPass = prompt("Enter old password:");
    if (oldPass === null) return;
    if (!this.verifyPassword(oldPass))
      throw new Error("Old password incorrect.");
    let newPass = prompt("Enter new password:");
    if (newPass === null) return;
    this.password = newPass;
    alert("Password changed.");
  };
}

// Static methods
Customer.validateUsername = function (username) {
  return typeof username === "string" && username.length >= 3;
};
Customer.validatePassword = function (password) {
  return typeof password === "string" && password.length >= 4;
};
