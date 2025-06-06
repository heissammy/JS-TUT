// Account model for Console Bank
import Transaction from './Transaction.js';
 
export default function Account (number, type, pin) {

  this.number = number;
  this.type = type;
  this.pin = pin;
  this.balance = 0;
  this.transactions = [];
  this.active = true;
  this.frozen = false;

  this.deposit = function (amount) {
    if (!this.active) throw new Error('Account is closed.');
    if (this.frozen) throw new Error('Account is frozen.');
    if (amount <= 0) throw new Error('Invalid amount.');
    this.balance += amount;
    this.addTransaction('deposit', amount, 'success', 'Deposit');
    return this.balance;
  };

  this.withdraw = function (amount) {
    if (!this.active) throw new Error('Account is closed.');
    if (this.frozen) throw new Error('Account is frozen.');
    if (amount <= 0) throw new Error('Invalid amount.');
    if (amount > this.balance) throw new Error('Insufficient funds.');
    this.balance -= amount;
    this.addTransaction('withdraw', amount, 'success', 'Withdraw');
    return this.balance;
  };

  this.transfer = function (amount, targetAccount) {
    if (!this.active) throw new Error('Account is closed.');
    if (this.frozen) throw new Error('Account is frozen.');
    this.withdraw(amount);
    targetAccount.deposit(amount);
    this.addTransaction('transfer', amount, 'success', 'To: ' + targetAccount.number);
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
  }
  
  this.addTransaction = function (type, amount, status, details) {
    this.transactions.push(new Transaction(type, amount, status, details));
  }
}

Account.validatePin = function(pin) {
  return typeof pin === 'string' && pin.length === 4 && /^\d{4}$/.test(pin);
};

Account.validateAmount = function(amount) {
  return typeof amount === 'number' && amount > 0;
}