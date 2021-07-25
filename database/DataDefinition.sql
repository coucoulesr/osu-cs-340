-- Database Definition Queries


-------- Create Tables --------

-- Classes
DROP TABLE IF EXISTS Classes;
CREATE TABLE Classes
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    subject varchar(255),
    course_number int,
    section int
);

-- Assignments
DROP TABLE IF EXISTS Assignments;
CREATE TABLE Assignments
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    class_id int(11) NOT NULL,
    title varchar(255),
    FOREIGN KEY (class_id) REFERENCES Classes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Students
DROP TABLE IF EXISTS Students;
CREATE TABLE Students
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,     
    last_name varchar(255) NOT NULL,
    pin int(11) NOT NULL
);

-- Ratings
DROP TABLE IF EXISTS Ratings;
CREATE TABLE Ratings
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    score smallint(1) NOT NULL,
    category varchar(255) NOT NULL, 
    assignment_id int(11) NOT NULL,
    author_id int(11) NOT NULL,
    FOREIGN KEY (assignment_id) REFERENCES Assignments (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (author_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    CHECK (category IN ('difficulty', 'helpfulness', 'satisfaction')),
    UNIQUE (assignment_id, author_id, category)
);

-- Comments
DROP TABLE IF EXISTS Comments;
CREATE TABLE Comments
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    body text NOT NULL,
    created DATETIME NOT NULL,
    author_id int(11) NOT NULL,
    assignment_id int(11) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES Assignments (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Votes
DROP TABLE IF EXISTS Votes;
CREATE TABLE Votes
(
    student_id int(11),
    comment_id int(11),
    value smallint(1),
    FOREIGN KEY (student_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES Comments (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Students_Classes relationship
DROP TABLE IF EXISTS Students_Classes;
CREATE TABLE Students_Classes
(
    student_id int(11),
    class_id int(11),
    FOREIGN KEY (student_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Students_Assignments relationship
DROP TABLE IF EXISTS Students_Assignments;
CREATE TABLE Students_Assignments
(
    student_id int(11),
    assignment_id int(11),
    FOREIGN KEY (student_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES Assignments (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-------- Sample Data --------

-- Classes
INSERT INTO Classes (title, subject, course_number, section)
VALUES ();

-- Assignments
INSERT INTO Assignments (class_id, title)
VALUES ();

-- Students
INSERT INTO Students (first_name, last_name, pin)
VALUES ();

-- Ratings
INSERT INTO Ratings (score, category, assignment_id, author_id)

-- Comments
INSERT INTO Comments (body, created, author_id, assignment_id)
VALUES ();

-- Votes
INSERT Votes (student_id, comment_id, value)
VALUES ();

-- Students_Classes relationship
INSERT INTO Students_Classes (student_id, class_id)
VALUES ();

-- Students_Assignments relationship
INSERT INTO Students_Assignments (student_id, assignment_id)
VALUES ();
