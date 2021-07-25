-- Many of the data manipulation queries shown here will use variable input from the user
-- or from the backend of the database. Where this is the case we have marked the input with 
-- a leading colon ':' and used generic terms to describe the input


-------- STUDENTS --------

-- Add Student

-- Update Student

--------CLASSES --------

-- Add class
INSERT INTO Classes (title, subject, course_number, section)
VALUES (:titleInput, :subjectInput, :numInput, :sectionInput);  

-- Update class
UPDATE Classes SET title = :newTitle, subject = :newSubject, course_number = :newCourseNum, section = :newSection;

-- Delete Class
DELETE FROM Classes WHERE id = :classToDelete

-------- ASSIGNMENTS --------

-- Add Assignment

-- Update Assignment

-------- RATINGS --------

-- Add Rating
INSERT INTO Ratings (score, category, assignment_id, author_id) 
VALUES (:scoreInput, :categoryInput, :assignmentInput, :authorInput);

-- Update Rating
UPDATE Ratings SET score = :newScore WHERE assignment_id = :currentAssignment AND author_id = :currentStudent AND category = 'difficulty';
UPDATE Ratings SET score = :newScore WHERE assignment_id = :currentAssignment AND author_id = :currentStudent AND category = 'helpfulness';
UPDATE Ratings SET score = :newScore WHERE assignment_id = :currentAssignment AND author_id = :currentStudent AND category = 'satisfaction';
-- something to think about, how are we getting the assignment_id and storing it?

-- Remove Rating
DELETE FROM Ratings WHERE assignment_id = :currentAssignment AND author_id = currentStudent AND category = 'difficulty';
DELETE FROM Ratings WHERE assignment_id = :currentAssignment AND author_id = currentStudent AND category = 'helpfulness';
DELETE FROM Ratings WHERE assignment_id = :currentAssignment AND author_id = currentStudent AND category = 'satisfaction';

-- Select Ratings to display on score sliders
SELECT score, COUNT (score) FROM ratings WHERE assignment_id = :currentAssignment AND category = "difficulty" GROUP BY score;
SELECT score, COUNT (score) FROM ratings WHERE assignment_id = :currentAssignment AND category = "helpfulness" GROUP BY score;
SELECT score, COUNT (score) FROM ratings WHERE assignment_id = :currentAssignment AND category = "satisfaction" GROUP BY score;

-------- COMMENTS --------

-- Add Comment

-- Update Comment

-- Delete Comment

-------- VOTES --------

-- Add Vote
INSERT INTO Votes (student_id, comment_id, value) 
VALUES (:studentInput, :commentInput, :valueInput);

-- Update Vote
UPDATE Votes SET value = :newValue WHERE student_id = :currentStudent AND comment_id = ()

-- Remove Vote
DELETE FROM Votes WHERE student_id = :currentStudent AND comment_id = :selectedComment

-- Get total votes for each comment
SELECT SUM (value) FROM Votes WHERE comment_id = :selectedComment

-- Get user's vote on each comment
SELECT value FROM Votes WHERE student_id = :currentStudent AND comment_id = :selectedComment


SELECT comments.body, comments.author_id, SUM(votes.value), IF (, "TRUE", "FALSE")
FROM comments 
JOIN votes ON comments.id = votes.comment_id 
JOIN assignments ON comments.assignment_id = assignments.id 
WHERE assignments.id = :currentAssignment
GROUP BY comments.id;