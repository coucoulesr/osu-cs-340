// ---------- APPLICATION SETUP ----------
// Get Dependencies
var express = require("express");
const { createPool } = require("mariadb");
var path = require("path");
var handlebars = require("express-handlebars").create();
const dbUtil = require("./utils/DbUtil");
const ratingPercents = require("./utils/RatingsUtil");

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

const DATABASE_HOST = process.env.COURSESIGNAL_DB_HOST || "coursesignal_db";
const DATABASE_USER = process.env.COURSESIGNAL_DB_USER || "root";
const DATABASE_PASSWORD = process.env.COURSESIGNAL_DB_PASSWORD || "";
const DATABASE_NAME = process.env.COURSESIGNAL_DB_NAME || "test";

// Set up database connection
const db = new dbUtil({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  connectionLimit: 5,
});

// ---------- ROUTING ----------

// Main page (get all courses)
app.get("/", async (req, res) => {
  let courses = await db.select("Classes");
  if (req.query.search) {
    const filter = req.query.search;
    courses = courses.filter((course) => {
      const courseString = `${course.subject}${course.course_number} - ${course.title}`;
      return courseString.includes(filter);
    });
  }
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
  res.render("course-info.handlebars", { course, students, assignments });
});

// Get all students
app.get("/students", async (req, res) => {
  let students = await db.select("Students");
  if (req.query.search) {
    const filter = req.query.search;
    students = students.filter((student) => {
      const studentString = `${student.pin} - ${student.first_name} ${student.last_name}`;
      return studentString.includes(filter);
    });
  }
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
  const { assignment, comments, ratings } = await db.getAssignmentInfo(
    req.params.id
  );
  let percents = ratingPercents(ratings);
  res.render("assignment.handlebars", {
    assignment,
    comments,
    ratings,
    percents,
  });
});

// Get JSON encoded list of students
app.get("/students-list", async (req, res) => {
  res.send(await db.select("Students"));
});

// Add new course
app.post("/create-student", async (req, res) => {
  await db.insert("Students", req.body);
  res.redirect("/students");
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

// Alter ratings
app.post("/assignments/:id/ratings", async function (req, res) {
  // req.body is {category: value, score: value}

  // UPDATE if user already submitted rating for this assignment
  if (await db.isRated(1, req.params.id, req.body.category)) {
    // Author ID is hardcoded because we did not implement multiple user views
    await db.updateRating(req.body.score, 1, req.params.id, req.body.category);
  }

  // INSERT if no rating submitted yet
  else {
    // Insert new values into database
    await db.insert("Ratings", {
      category: req.body.category,
      score: req.body.score,
      assignment_id: parseInt(req.params.id), // We are given a string, but an integer is needed
      author_id: 1, // This is a hardcoded value because we did not implement using multiple users
    });
  }

  // Get ratings from database
  let { ratings } = await db.getAssignmentRatings(req.params.id); // Need to have ratings in {}
  let percents = ratingPercents(ratings);

  // Send values back to page
  res.send({ ratings, percents });
});

// Add new comment
app.post("/create-comment", async (req, res) => {
  await db.insert("Comments", {
    ...req.body,
    created: new Date(Date.now())
      .toISOString()
      .replace("T", " ")
      .replace("Z", ""),
  });
  res.redirect("/assignments/" + req.body.assignment_id);
});

// Update votes on a comment
app.post("/assignments/updateVote/:comment_id", async function(req, res){
  // req.body is {comment_id: number, student_id: number, value: number}

  // UPDATE if user already submitted rating for this assignment
  let vote = await db.hasVoted(req.body.student_id, req.body.comment_id)
  if (vote.hasVoted) {
    // Author ID is hardcoded because we did not implement multiple user views
    if (vote.value == -1 || vote.value == 1)
    {
      await db.updateVote(req.body.student_id, req.body.comment_id, 0);
    }
    
  }

  // INSERT if no vote submitted yet
  else {
    // Insert new values into database
    await db.insert("Votes", {
      student_id: req.body.student_id,
      comment_id: req.body.comment_id,
      value: req.body.value, 
    });
  }

  let votesum  = await db.getVoteSum(req.body.comment_id);
  // Send values back to page
  res.send(votesum);
})

// Add student to course
app.post("/add-student-to-course", async (req, res) => {
  const { student_id, class_id } = req.body;
  await db.insert("Students_Classes", { student_id, class_id });
  res.redirect("/courses/" + req.body.class_id);
});

// Edit course
app.post("/edit-course/:id", async (req, res) => {
  await db.editCourse(req.params.id, req.body.title);
  res.redirect("/");
});

// Edit student
app.post("/edit-student/:id", async (req, res) => {
  await db.editStudent(req.params.id, req.body);
  res.redirect("/students");
});

// Edit assignment
app.post("/edit-assignment/:id", async (req, res) => {
  await db.editAssignment(req.params.id, req.body.title);
  res.redirect(req.body.redirect || "/");
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

// Delete student by id
app.delete("/delete-student/:id", async (req, res) => {
  const result = await db.delete("Students", {
    filters: ["id=?"],
    filterParams: [req.params.id],
  });
  if (result.affectedRows > 0) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Delete assignment by id
app.delete("/delete-assignment/:id", async (req, res) => {
  const result = await db.delete("Assignments", {
    filters: ["id=?"],
    filterParams: [req.params.id],
  });
  if (result.affectedRows > 0) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Delete comment by id
app.delete("/delete-comment/:id", async (req, res) => {
  const result = await db.delete("Comments", {
    filters: ["id=?"],
    filterParams: [req.params.id],
  });
  if (result.affectedRows > 0) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Disassociate student from course
app.delete("/remove-student-from-course", async (req, res) => {
  const { student_id, class_id } = req.body;
  console.log(`remove student: ${student_id} - ${class_id}`);
  const result = await db.delete("Students_Classes", {
    filters: ["student_id=?", "class_id=?"],
    filterParams: [student_id, class_id],
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
