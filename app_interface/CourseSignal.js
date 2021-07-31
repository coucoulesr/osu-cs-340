// ---------- APPLICATION SETUP ----------
// Get Dependencies
var express = require('express');
var path = require('path');
var mysql = require('mysql');
const { fileURLToPath } = require('url');
var handlebars = require('express-handlebars').create()

// Create SQL Pool
let pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_cannonst',
    password        : 'b5o9 pota^o',
    database        : 'cs340_cannonst',
})

// Initialize express
var app = express();

// View engine setup
app.engine('handlebars', handlebars.engine);     // Defines handlebars as the view engine
app.set('view engine', 'handlebars');                 

// Static Files setup
app.use(express.static(path.join(__dirname, 'public'))) // App will get static files from the public folder

// Set app to auto-detect POST content type
app.use(express.json())
app.use(express.urlencoded({extended: false}))



// ---------- ROUTING ----------

// Main page
app.get('/', function(req, res){


    res.render('courses.handlebars', context)
})

// Course page
app.get('/test', function(req, res){
    res.render('assignments.handlebars')
})



// ---------- LAUNCH ----------
app.set('port', 4000)
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
})