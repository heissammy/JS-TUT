// File: js/Models/Transaction.js
// Transaction.js

export default function Transaction (type, amount, status, details) {
    // this is for each transaction
    this.type = type;
    this.amount = amount;
    this.status = status;
    this.details = details;
    this.date = new Date();
}