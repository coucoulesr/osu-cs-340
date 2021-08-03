// ---------- APPLICATION SETUP ----------
// Get Dependencies
var express = require("express");
var path = require("path");
var handlebars = require("express-handlebars").create();
const dbUtil = require("./utils/DbUtil");
const { fileURLToPath } = require("url");

// Initialize express
var app = express();

// View engine setup
app.engine("handlebars", handlebars.engine); // Defines handlebars as the view engine
app.set("view engine", "handlebars");

// Static Files setup
app.use(express.static(path.join(__dirname, "public"))); // App will get static files from the public folder

// Set app to auto-detect POST content type
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up database connection
const db = new dbUtil({
  host: "coursesignal_db",
  user: "root",
  database: "test",
  connectionLimit: 5,
});

// ---------- ROUTING ----------

// Main page (get all courses)
app.get("/", async (req, res) => {
  const courses = await db.select("Classes");
  res.render("classes.handlebars", { courses });
});

// Get course info
app.get("/courses/:id", async (req, res) => {
  const [course] = await db.select("Classes", {
    filters: ["id=?"],
    filterParams: [req.params.id],
  });
  const students = await db.getStudentsInCourse(course.id);
  const assignments = await db.getAssignmentsInCourse(course.id);
  res.render("assignments.handlebars", { course, students, assignments });
});

// Get all students
app.get("/students", async (req, res) => {
  const students = await db.select("Students");
  res.render("students.handlebars", { students });
});

// Get student info
app.get("/students/:id", async (req, res) => {
  const [student] = await db.select("Students", {
    filters: ["id=?"],
    filterParams: [req.params.id],
  });
  const courses = await db.getCoursesWithStudent(student.id);
  res.render("student.handlebars", { student, courses });
});

// Get course info
app.get("/assignments/:id", async (req, res) => {
  const { comments, ratings } = await db.getAssignmentInfo(req.params.id);
  console.log(comments);
  res.render("assignment.handlebars", {
    assignment: { id: req.params.id },
    comments,
    ratings,
  });
});

// Add new course
app.post("/create-course", async (req, res) => {
  await db.insert("Classes", req.body);
  res.redirect("/");
});

// Add new assignment
app.post("/create-assignment", async (req, res) => {
  await db.insert("Assignments", req.body);
  res.redirect("/courses/" + req.body.class_id);
});

// Add new review
app.post("/create-review", async (req, res) => {
  await db.insert("Comments", {
    ...req.body,
    created: new Date(Date.now())
      .toISOString()
      .replace("T", " ")
      .replace("Z", ""),
  });
  res.redirect("/assignments/" + req.body.assignment_id);
});

// Add student to course
app.post("/add-student-to-course", async (req, res) => {
  await db.insert("Students_Classes", {
    student_id: req.body.student_id,
    class_id: req.body.class_id,
  });
  res.redirect("/courses/" + req.body.class_id);
});

// Edit assignment
app.put("/edit-assignment/:id", async (req, res) => {
  await db.editAssignment(req.params.id, req.body.title);
  res.redirect("/assignments/" + req.params.assignment_id);
});

// Delete course by id
app.delete("/delete-course/:id", async (req, res) => {
  const result = await db.delete("Classes", {
    filters: ["id=?"],
    filterParams: [req.params.id],
  });
  if (result.affectedRows > 0) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ---------- LAUNCH ----------
app.set("port", 4000);
app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
