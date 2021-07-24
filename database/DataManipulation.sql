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

-------- ASSIGNMENTS --------

-- Add Assignment

-- Update Assignment

-------- RATINGS --------

-- Add Rating
INSERT INTO Ratings (score, category, assignment_id, author_id) 
VALUES (:scoreInput, :categoryInput, :assignmentInput, :authorInput)

-- Update Rating

-- Remove Rating


-------- VOTES --------

-- Add Vote

-- Update Vote

