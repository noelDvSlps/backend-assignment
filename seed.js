const fs = require("fs");
const seed = [
  {
    id: "GUPLXUQHCH",
    firstName: "mochi",
    lastName: "hurray",
    grade: 1,
    classes: ["Science", "History", "Math", "Art"],
    createdOn: "2023-08-26T04:50:36.109Z",
    updatedOn: "2023-08-26T18:37:16.547Z",
  },
  {
    id: "GUPLXUQHCK",
    firstName: "michael",
    lastName: "jordan",
    grade: 1,
    classes: ["Art"],
    createdOn: "2023-08-26T04:50:36.109Z",
    updatedOn: "2023-08-26T17:21:18.467Z",
  },
  {
    id: "LATFLPTRHJ",
    firstName: "stephen",
    lastName: "curry",
    grade: 1,
    classes: ["Math"],
    createdOn: "2023-09-06T20:15:39.333Z",
    updatedOn: "2023-09-06T20:15:39.333Z",
  },
];

fs.writeFileSync("students.json", JSON.stringify(seed));
