// //STUDENT ARRAY
// let student = [
//   {
//     name: "Stella",
//     age: 16,
//     subjects: ["Math", "English", "Physics"],
//     scores: [85, 87, 72],
//     classGrade: "11th Grade",
//     gender: "female",
//     isEnrolled: true,

//     greet: function () {
//       console.log(`Hi, i'm ${this.name}`);
//     },
//     getAverageScore: function () {
//       let total = this.scores.reduce((sum, score) => sum + score, 0);
//       return total / this.scores.length;
//     },
//     isPassing: function () {
//       return this.getAverageScore() >= 60;
//     },
//   },
// ];
// console.log(student[0].greet());
// console.log(student[0].name);
// console.log(student[0].subjects);
// console.log(student[0].age);
// console.log(student[0].scores);
// console.log(student[0].classGrade);
// console.log(student[0].gender);
// console.log(student[0].getAverageScore());
// console.log(student[0].isPassing());

// //AN ARRAY OF BOOK COLLECTION
// let books = [
//   {
//     title: "The Great Seige",
//     author: "F. Scott Fitzgerald",
//     isAvailable: true,
//     borrowedBy: null,
//     yearPublished: 1925,
//     genre: "Classic",
//     pages: 180,

//     borrowBook: function (borowerName) {
//       if (this.isAvailable === true) {
//         this.borrowedBy = borowerName;
//         this.isAvailable = false;
//         console.log(`${this.title} has been borrowed by ${borowerName}.`);
//       } else {
//         console.log(`${this.title} is already borrowed by ${this.borrowedBy}.`);
//       }
//     },

//     returnBook: function () {
//       this.isAvailable = true;
//       this.borrowedBy = null;
//       console.log(`${this.title} has been returned by ${this.borrowedBy}.`);
//     },

//     bookInfo: function () {
//       return `${this.title} by ${this.author} (${this.yearPublished}) - ${this.genre}, ${this.pages} pages.`;
//     }
//   },

//   {
//     title: "Wake-up Call",
//     author: "George Orwell",
//     isAvailable: true,
//     borrowedBy: "null",
//     yearPublished: 1949,
//     genre: "Dystopian",
//     pages: 328,

//     borrowBook: function (borowerName) {
//       if (this.isAvailable === true) {
//         this.borrowedBy = borowerName;
//         this.isAvailable = false;
//         console.log(`${this.title} has been borrowed by ${borowerName}.`);
//       } else {
//         console.log(`${this.title} is already borrowed by ${this.borrowedBy}.`);
//       }
//     },

//     returnBook: function () {
//       this.isAvailable = true;
//       this.borrowedBy = null;
//       console.log(`${this.title} has been returned by ${this.borrowedBy}.`);
//     },

//     bookInfo: function () {
//       return `${this.title} by ${this.author} (${this.yearPublished}) - ${this.genre}, ${this.pages} pages.`;
//     }
//   }
// ];
// books[0].borrowBook("juwon");

let Animal = function(legs, eyes, ears, speed, type)
  {
    this.legs = legs;
    this.eyes = eyes;
    this.ears = ears;
    this.speed = speed;
    this.type = type;

    this.walk = function () {
    console.log(`${this.type} is walking`);
  }

};

const dog = new Animal(4, 2, 2, "80km/h", "German Shepherd");
dog.walk();