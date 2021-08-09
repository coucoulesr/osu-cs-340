-- Database Definition Queries

-------- Create Tables --------

-- Classes
DROP TABLE IF EXISTS Classes;
CREATE TABLE Classes
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    course_number INT,
    section INT
);

-- Assignments
DROP TABLE IF EXISTS Assignments;
CREATE TABLE Assignments
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    class_id INT(11) NOT NULL,
    title VARCHAR(255),
    FOREIGN KEY (class_id) REFERENCES Classes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Students
DROP TABLE IF EXISTS Students;
CREATE TABLE Students
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,     
    last_name VARCHAR(255) NOT NULL,
    pin INT(11) NOT NULL
);

-- Ratings
DROP TABLE IF EXISTS Ratings;
CREATE TABLE Ratings
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    score SMALLINT(1) NOT NULL,
    category VARCHAR(255) NOT NULL, 
    assignment_id INT(11) NOT NULL,
    author_id INT(11) NOT NULL,
    FOREIGN KEY (assignment_id) REFERENCES Assignments (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (author_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (category IN ('difficulty', 'usefulness', 'satisfaction')),
    UNIQUE (assignment_id, author_id, category)
);

-- Comments
DROP TABLE IF EXISTS Comments;
CREATE TABLE Comments
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    body TEXT NOT NULL,
    created DATETIME NOT NULL,
    author_id INT(11) NOT NULL,
    assignment_id INT(11) NOT NULL,
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
    student_id INT(11),
    comment_id INT(11),
    value SMALLINT(1),
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
    student_id INT(11),
    class_id INT(11),
    FOREIGN KEY (student_id) REFERENCES Students (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);