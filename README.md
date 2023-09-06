classes.json = array of valid classes

# STUDENTS

## Create new

method: POST

/students
add body

## GET ALL STUDENTS

method: GET

/students

## GET STUDENT

method: GET

/students/id

## Update Student

method: PATCH

/students/id
add body

## Delete student

method: DELETE
/students/id

## Add a Class to a student

method: PATCH
/students/:id/classes/:classToAdd
sample: /students/ABCDE/classes/MATH,ENGLISH,SCIENCE
sample: /students/ABCDE/classes/MATH

## GET STUDENT'S CLASSES

method: GET
/students/:id/classes/

## Remove a class from a student

method: DELETE
/students/:id/classes/classToDelete
sample: /students/:id/classes/math
