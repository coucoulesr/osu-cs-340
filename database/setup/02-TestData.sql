INSERT INTO Classes (title, subject, course_number, section)
VALUES 
    ("Introduction to Computer Science I", "CS", 161, 13898),
    ("Organic Chemistry", "CH", 331, 10104),
    ("General Physics With Calculus", "PH", 211, 10076);

INSERT INTO Assignments (class_id, title)
VALUES
    ((SELECT id FROM Classes WHERE section=13898), "Python Hello World"),
    ((SELECT id FROM Classes WHERE section=13898), "For and While Loops"),
    ((SELECT id FROM Classes WHERE section=10104), "Stereochemistry in Benzene Rings"),
    ((SELECT id FROM Classes WHERE section=10104), "SN1 and SN2 Reactions"),
    ((SELECT id FROM Classes WHERE section=10076), "Impulse-Momentum Theorem"),
    ((SELECT id FROM Classes WHERE section=10076), "Newton's Third Law: Normal Forces");

INSERT INTO Students (first_name, last_name, pin)
VALUES
    ("Bugs", "Bunny", 1),
    ("Daffy", "Duck", 2),
    ("Sylvester", "Cat", 3),
    ("Tweety", "Bird", 4),
    ("Elmer", "Fudd", 5),
    ("Yosemite", "Sam", 6),
    ("Foghorn", "Leghorn", 7),
    ("Speedy", "Gonzales", 8);

INSERT INTO Students_Classes
VALUES
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Classes WHERE section=13898)),
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Classes WHERE section=10076)),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Classes WHERE section=13898)),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Classes WHERE section=10104)),
    ((SELECT id FROM Students WHERE pin=3), (SELECT id FROM Classes WHERE section=10104)),
    ((SELECT id FROM Students WHERE pin=4), (SELECT id FROM Classes WHERE section=10076)),
    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Classes WHERE section=13898)),
    ((SELECT id FROM Students WHERE pin=6), (SELECT id FROM Classes WHERE section=10104)),
    ((SELECT id FROM Students WHERE pin=7), (SELECT id FROM Classes WHERE section=10076)),
    ((SELECT id FROM Students WHERE pin=8), (SELECT id FROM Classes WHERE section=13898));

INSERT INTO Students_Assignments
VALUES
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Assignments WHERE title="For and While Loops")),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Assignments WHERE title="For and While Loops")),
    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Assignments WHERE title="For and While Loops")),
    ((SELECT id FROM Students WHERE pin=8), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ((SELECT id FROM Students WHERE pin=8), (SELECT id FROM Assignments WHERE title="For and While Loops")),

    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Assignments WHERE title="Stereochemistry in Benzene Rings")),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Assignments WHERE title="SN1 and SN2 Reactions")),
    ((SELECT id FROM Students WHERE pin=3), (SELECT id FROM Assignments WHERE title="Stereochemistry in Benzene Rings")),
    ((SELECT id FROM Students WHERE pin=3), (SELECT id FROM Assignments WHERE title="SN1 and SN2 Reactions")),
    ((SELECT id FROM Students WHERE pin=6), (SELECT id FROM Assignments WHERE title="Stereochemistry in Benzene Rings")),
    ((SELECT id FROM Students WHERE pin=6), (SELECT id FROM Assignments WHERE title="SN1 and SN2 Reactions")),

    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Assignments WHERE title="Impulse-Momentum Theorem")),
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Assignments WHERE title="Newton's Third Law: Normal Forces")),
    ((SELECT id FROM Students WHERE pin=4), (SELECT id FROM Assignments WHERE title="Impulse-Momentum Theorem")),
    ((SELECT id FROM Students WHERE pin=4), (SELECT id FROM Assignments WHERE title="Newton's Third Law: Normal Forces")),
    ((SELECT id FROM Students WHERE pin=7), (SELECT id FROM Assignments WHERE title="Impulse-Momentum Theorem")),
    ((SELECT id FROM Students WHERE pin=7), (SELECT id FROM Assignments WHERE title="Newton's Third Law: Normal Forces"));

INSERT INTO Ratings (score, category, assignment_id, author_id)
VALUES
    (1, "difficulty", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=1)),
    (0, "usefulness", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=1)),
    (1, "satisfaction", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=1)),

    (1, "difficulty", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=1)),
    (1, "usefulness", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=1)),
    (-1, "satisfaction", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=1)),

    (-1, "difficulty", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=2)),
    (0, "usefulness", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=2)),
    (1, "satisfaction", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=2)),

    (1, "difficulty", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=2)),
    (1, "usefulness", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=2)),
    (0, "satisfaction", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=2)),

    (-1, "difficulty", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=5)),
    (-1, "usefulness", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=5)),
    (0, "satisfaction", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=5)),

    (0, "difficulty", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=5)),
    (-1, "usefulness", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=5)),
    (-1, "satisfaction", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=5)),

    (1, "difficulty", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=8)),
    (1, "usefulness", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=8)),
    (0, "satisfaction", (SELECT id FROM Assignments WHERE title="Python Hello World"), (SELECT id FROM Students WHERE pin=8)),
    
    (0, "difficulty", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=8)),
    (1, "usefulness", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=8)),
    (1, "satisfaction", (SELECT id FROM Assignments WHERE title="For and While Loops"), (SELECT id FROM Students WHERE pin=8));

INSERT INTO Comments (body, created, author_id, assignment_id)
VALUES
    ("Great introduction to programming in Python!", "2021-07-23 08:00:00", (SELECT id FROM Students WHERE pin=1), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ("Frustratingly hard.", "2021-07-30 09:30:00", (SELECT id FROM Students WHERE pin=1), (SELECT id FROM Assignments WHERE title="For and While Loops")),

    ("Simple yet fulfilling.", "2021-07-25 23:50:00", (SELECT id FROM Students WHERE pin=2), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ("Perfectly challenging assignment; learned a lot!", "2021-07-31 22:00:00", (SELECT id FROM Students WHERE pin=2), (SELECT id FROM Assignments WHERE title="For and While Loops")),

    ("Awesome assignment!", "2021-07-25 14:00:00", (SELECT id FROM Students WHERE pin=5), (SELECT id FROM Assignments WHERE title="Python Hello World")),
    ("Everything is great!", "2021-07-31 16:00:00", (SELECT id FROM Students WHERE pin=5), (SELECT id FROM Assignments WHERE title="For and While Loops"));

INSERT INTO Votes
VALUES
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Comments WHERE body="Simple yet fulfilling."), 1),
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Comments WHERE body="Perfectly challenging assignment; learned a lot!"), -1),
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Comments WHERE body="Awesome assignment!"), 1),
    ((SELECT id FROM Students WHERE pin=1), (SELECT id FROM Comments WHERE body="Everything is great!"), -1),

    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Comments WHERE body="Great introduction to programming in Python!"), 1),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Comments WHERE body="Frustratingly hard."), -1),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Comments WHERE body="Awesome assignment!"), 1),
    ((SELECT id FROM Students WHERE pin=2), (SELECT id FROM Comments WHERE body="Everything is great!"), 1),

    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Comments WHERE body="Great introduction to programming in Python!"), 1),
    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Comments WHERE body="Frustratingly hard."), 1),
    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Comments WHERE body="Simple yet fulfilling."), 1),
    ((SELECT id FROM Students WHERE pin=5), (SELECT id FROM Comments WHERE body="Perfectly challenging assignment; learned a lot!"), 1);