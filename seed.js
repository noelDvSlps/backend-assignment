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
    id: "GUPLXUQHCH",
    firstName: "mochi",
    lastName: "hurray",
    grade: 1,
    classes: ["Art"],
    createdOn: "2023-08-26T04:50:36.109Z",
    updatedOn: "2023-08-26T17:21:18.467Z",
  },
];

fs.writeFileSync("students.json", JSON.stringify(seed));
