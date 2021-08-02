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
  res.render("courses.handlebars", { courses });
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

// Add new assignment
app.post("/", async (req, res) => {
  await db.insert("Classes", req.body);
  res.redirect("/");
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
