const http = require("http");
const express = require("express");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const port = 3001;

// this line is required to parse the request body

app.use(express.json());

// util functions

/* get random letter */
const getRandomLetter = () => {
  return String.fromCharCode(0 | (Math.random() * 26 + 97));
};

/* get random letters */
const getRandomLetters = (numOfChar) => {
  let id = "";
  for (let i = 0; i < numOfChar; i++) {
    id += getRandomLetter().toUpperCase();
  }
  return id;
};

/* create new id*/
const createNewId = () => {
  const students = getStudentsData();
  const userIds = students.map((student) => student.id);
  let newId = getRandomLetters(10);

  while (userIds.filter((id) => id === newId).length > 0) {
    newId = getRandomLetters(10);
  }
  return newId;
};

// read data from json
const saveStudentData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("students.json", stringifyData);
};

// get student data from json
const getStudentsData = () => {
  const jsonData = fs.readFileSync("students.json");
  return JSON.parse(jsonData);
};

//sort
const sortLastName = (arr, sortType) => {
  const sortTypes = ["asc", "desc"];

  if (!sortTypes.find((type) => type === sortType)) {
    return { error: true, message: "Invalid type of sort" };
  }
  return arr.sort((a, b) => {
    if (a.lastName < b.lastName) {
      return sortType === "asc" ? -1 : 1;
    }
    if (a.lastName > b.lastName) {
      return sortType === "asc" ? 1 : -1;
    }
    return 0;
  });
};

//limit
const limit = (arr, num) => {
  if (isNaN(num)) {
    return { error: true, message: "Limit should be a number" };
  }
  const parsedNum = parseInt(num);
  return arr.slice(0, parsedNum);
};

// get student properties from json
const getStudentProperties = () => {
  const jsonData = fs.readFileSync("studentProperties.json");
  return JSON.parse(jsonData);
};

/*Create -POST method */
app.post("/students", (req, res) => {
  const students = getStudentsData();
  const studentProperties = getStudentProperties();
  const newId = createNewId();
  const missingProperties = [];

  for (let i = 0; i < studentProperties.length; i++) {
    const studentProperty = studentProperties[i];
    if (!req.body[studentProperty]) {
      missingProperties.push(studentProperty);
    }
  }

  if (missingProperties.length > 0) {
    return res.status(401).send({
      error: true,
      message: `Student Data is missing ${missingProperties}`,
    });
  }

  const newStudent = {
    id: newId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    grade: req.body.grade,
    classes: req.body.classes,
    createdOn: new Date(),
    updatedOn: new Date(),
  };

  students.push(newStudent);

  saveStudentData(students);
  res.send({ success: true, message: "Student added successfully" });
});

/* Read - GET method */
app.get("/students", (req, res) => {
  const students = getStudentsData();
  const query = req.query;
  let errors = [];
  let result = null;
  if ("sort" in query) {
    result = sortLastName(students, query.sort);
    result.error && errors.push(result);
  }
  if ("limit" in query) {
    try {
      result = limit(result === null ? students : result, query.limit);
      result.error && errors.push(result);
    } catch {}
  }
  if (errors.length > 0) {
    res.status(409).send(errors);
    return;
  }
  query === {} ? res.send(students) : res.send(result);
});

app.get("/students/:id", (req, res) => {
  const students = getStudentsData();
  const found = students.find((student) => student.id === req.params.id);
  if (found) {
    res.status(200).json(found);
  } else {
    res.sendStatus(404);
  }
});

app.get("/students/:id/classes", (req, res) => {
  const students = getStudentsData();
  const found = students.find((student) => student.id === req.params.id);
  if (found) {
    res.status(200).json(found.classes);
  } else {
    res.sendStatus(404);
  }
});

/* Update -PUT/PATCH */
app.put("/students/:id", (req, res) => {
  const students = getStudentsData();
  const found = students.find((student) => student.id === req.params.id);
  if (found) {
    const updated = {
      id: found.id,
      firstName: req.body.firstName || found.firstName,
      lastName: req.body.lastName || found.lastName,
      grade: req.body.grade || found.grade,
      classes: req.body.classes || found.classes,
      createdOn: found.createdOn,
      updatedOn: new Date(),
    };

    const targetIndex = students.indexOf(found);
    students.splice(targetIndex, 1, updated);
    saveStudentData(students);
    res.send({ success: true, message: "Student updated successfully" });
  } else {
    res.sendStatus(404);
  }
});

app.patch("/students/:id/classes", (req, res) => {
  //req.body should be an object with classes key. sample =  {classes: ["Science", "Art"]}
  const students = getStudentsData();
  const found = students.find((student) => student.id === req.params.id);
  const classes = req.body.classes;
  const classesAlreadyExists = [];

  if (found) {
    for (let i = 0; i < classes.length; i++) {
      const foundClass = found.classes.find((varClass) => {
        return varClass.toUpperCase() === classes[i].toUpperCase();
      });
      if (foundClass) {
        classesAlreadyExists.push(classes[i]);
      }
    }

    if (classesAlreadyExists.length > 0) {
      return res.send({
        success: false,
        message: `Classes ${classesAlreadyExists} already exists and cannot be added`,
      });
    }

    const updated = {
      ...found,
      classes: [...found.classes, ...classes],
      updatedOn: new Date(),
    };

    const targetIndex = students.indexOf(found);
    students.splice(targetIndex, 1, updated);
    saveStudentData(students);
    res.send({ success: true, message: "Student updated successfully" });
  } else {
    res.sendStatus(404);
  }
});

app.delete("/students/:id", (req, res) => {
  const students = getStudentsData();
  const id = req.params.id;

  const filteredUser = students.filter((student) => student.id !== id);

  if (students.length === filteredUser.length) {
    return res
      .status(409)
      .send({ error: true, message: "Student does not exist" });
  }
  saveStudentData(filteredUser);
  res.send({ success: true, message: "Student removed successfully" });
});

app.delete("/students/:id/classes/:class", (req, res) => {
  // if you want to remove for example "Math" class from classes
  // endpoint should be like this "/students/1/classes/Math"
  const students = getStudentsData();
  const id = req.params.id;
  const filteredUser = students.filter((student) => student.id === id);

  const filteredClasses = filteredUser[0].classes.filter(
    (varClass) => varClass !== req.params.class
  );

  if (filteredClasses.length === filteredUser[0].classes.length) {
    return res
      .status(409)
      .send({ error: true, message: "Class does not exist" });
  }

  const updated = {
    ...filteredUser[0],
    classes: filteredClasses,
    updatedOn: new Date(),
  };

  const targetIndex = students.indexOf(filteredUser[0]);
  students.splice(targetIndex, 1, updated);
  saveStudentData(students);

  res.send({ success: true, message: "Class removed successfully" });
});

app.listen(port, () => console.log(`server is listening on port ${port}`));
