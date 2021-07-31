// ---------- APPLICATION SETUP ----------
// Get Dependencies
var express = require("express");
var path = require("path");
var handlebars = require("express-handlebars").create();
const dbUtil = require("./utils/DbUtil");

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

// Main page
app.get("/", function (req, res) {
  res.render("courses.handlebars");
});

app.get("/classes", async (req, res) => {
  res.status(200).send(await db.getClasses());
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
