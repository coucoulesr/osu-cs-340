const mariadb = require("mariadb");

class db {
  // Constructor: generates and tests database pool
  constructor(poolOptions) {
    const pool = this.createPool(poolOptions);
    this.#testPool(pool).then((pass) => {
      if (pass) this.pool = pool;
    });
  }

  // Method wrapper for mariadb create pool function
  createPool(poolOptions) {
    return mariadb.createPool(poolOptions);
  }

  // Returns true if database connection is successful
  // Else throws error
  async #testPool(pool) {
    try {
      const conn = await pool.getConnection();
      try {
        await conn.ping();
        console.log("Database connection successful.");
        return true;
      } catch (pingErr) {
        throw new Error(
          "Error in connected database configuration: ",
          pingErr.message
        );
      }
    } catch (connectionErr) {
      throw new Error(
        "Error establishing database connection: ",
        connectionErr.message
      );
    }
  }

  // Select from table using given filters
  async select(table, { filters = null, filterParams = [] } = {}) {
    try {
      let query = "SELECT * FROM " + table;
      if (filters) {
        query += " WHERE ";
        for (let filter of filters) {
          query += `${filter} AND `;
        }
        query = query.slice(0, query.length - 5);
      }
      query += ";";
      const output = await this.pool.query(query, filterParams);
      return output;
    } catch (e) {
      console.error("db.select error: ", e);
      throw e;
    }
  }

  // Insert object (item) into table
  async insert(table, item) {
    try {
      let query = "INSERT INTO " + table + " (";
      let queryParams = [];
      for (let key in item) {
        query += `${key}, `;
      }
      query = query.slice(0, query.length - 2);
      query += ")\nVALUES (";
      for (let key in item) {
        query += "?, ";
        queryParams.push(item[key]);
      }
      query = query.slice(0, query.length - 2);
      query += ");";
      const output = await this.pool.query(query, queryParams);
      return output;
    } catch (e) {
      console.error("db.insert error: ", e);
      throw e;
    }
  }

  // Delete from table elements which match given filters
  async delete(table, { filters, filterParams }) {
    try {
      if (!filters || filters.length === 0) {
        throw new Error("db.delete requires a filter parameter.");
      }
      let query = "DELETE FROM " + table + " WHERE ";
      for (let filter of filters) {
        query += `${filter} AND `;
      }
      query = query.slice(0, query.length - 5);
      query += ";";
      const output = await this.pool.query(query, filterParams);
      return output;
    } catch (e) {
      console.error("db.delete error: ", e);
      throw e;
    }
  }

  // Returns array of students in course by courseId
  async getStudentsInCourse(courseId) {
    try {
      const output = await this.pool.query(
        "SELECT s.* FROM Students s " +
          "INNER JOIN Students_Classes sc ON sc.student_id=s.id " +
          "INNER JOIN Classes c ON c.id=sc.class_id " +
          "WHERE c.id=?;",
        [courseId]
      );
      return output;
    } catch (e) {
      console.error("db.getStudentsInCourse error: ", e);
      throw e;
    }
  }

  // Returns array of assignments in course by courseId
  async getAssignmentsInCourse(courseId) {
    try {
      const output = await this.pool.query(
        "SELECT a.* FROM Assignments a " +
          "INNER JOIN Classes c ON c.id=a.class_id " +
          "WHERE c.id=?;",
        [courseId]
      );
      return output;
    } catch (e) {
      console.error("db.getStudentsInCourse error: ", e);
      throw e;
    }
  }

  // Returns array of all courses student with given ID is enrolled in
  async getCoursesWithStudent(studentId) {
    try {
      const output = await this.pool.query(
        "SELECT c.* FROM Students s " +
          "INNER JOIN Students_Classes sc ON sc.student_id=s.id " +
          "INNER JOIN Classes c ON c.id=sc.class_id " +
          "WHERE s.id=?;",
        [studentId]
      );
      return output;
    } catch (e) {
      console.error("db.getCoursesWithStudent error: ", e);
      throw e;
    }
  }

  // Returns object with properties "assignment" (object), "comments" (array), "ratings" (object)
  //   - assignment contains information about the assignment
  //   - comments contains all of the comments associated with the assignment
  //   - ratings contains aggregate totals of all rating categories associated with the assignment
  async getAssignmentInfo(assignmentId) {
    try {
      const [assignment] = await this.pool.query(
        "SELECT * FROM Assignments WHERE id=?",
        [assignmentId]
      );
      const comments = await this.pool.query(
        "SELECT s.id as student_id, s.first_name, s.last_name, c.*, COUNT(v.value) AS votes, SUM(v.value) AS score FROM Comments c " +
          "LEFT JOIN Votes v ON v.comment_id=c.id " +
          "INNER JOIN Assignments a ON a.id=c.assignment_id " +
          "INNER JOIN Students s ON s.id=c.author_id " +
          "WHERE a.id=? " +
          "GROUP BY c.id;",
        [assignmentId]
      );
      const ratings = {
        difficulty: { upvotes: 0, midvotes: 0, downvotes: 0 },
        usefulness: { upvotes: 0, midvotes: 0, downvotes: 0 },
        satisfaction: { upvotes: 0, midvotes: 0, downvotes: 0 },
      };
      const upvotes = await this.pool.query(
        "SELECT COUNT(*) as count, category FROM Ratings " +
          "WHERE assignment_id=? AND score=1 " +
          "GROUP BY category;",
        [assignmentId]
      );
      for (let row of upvotes) {
        ratings[row.category] = {
          ...ratings[row.category],
          upvotes: row.count,
        };
      }

      const midvotes = await this.pool.query(
        "SELECT COUNT(*) as count, category FROM Ratings " +
          "WHERE assignment_id=? AND score=0 " +
          "GROUP BY category;",
        [assignmentId]
      );
      for (let row of midvotes) {
        ratings[row.category] = {
          ...ratings[row.category],
          midvotes: row.count,
        };
      }

      const downvotes = await this.pool.query(
        "SELECT COUNT(*) as count, category FROM Ratings " +
          "WHERE assignment_id=? AND score=-1 " +
          "GROUP BY category;",
        [assignmentId]
      );
      for (let row of downvotes) {
        ratings[row.category] = {
          ...ratings[row.category],
          downvotes: row.count,
        };
      }
      return { assignment, comments, ratings };
    } catch (e) {
      console.error("db.getAssignmentInfo error: ", e);
      throw e;
    }
  }

  // Returns an object with property "ratings" (object)
  //   - ratings contains aggregate totals of all rating categories associated with the assignment
  async getAssignmentRatings(assignmentId) {
    try {
      const ratings = {
        difficulty: { upvotes: 0, midvotes: 0, downvotes: 0 },
        usefulness: { upvotes: 0, midvotes: 0, downvotes: 0 },
        satisfaction: { upvotes: 0, midvotes: 0, downvotes: 0 },
      };
      const upvotes = await this.pool.query(
        "SELECT COUNT(*) as count, category FROM Ratings " +
          "WHERE assignment_id=? AND score=1 " +
          "GROUP BY category;",
        [assignmentId]
      );
      for (let row of upvotes) {
        ratings[row.category] = {
          ...ratings[row.category],
          upvotes: row.count,
        };
      }

      const midvotes = await this.pool.query(
        "SELECT COUNT(*) as count, category FROM Ratings " +
          "WHERE assignment_id=? AND score=0 " +
          "GROUP BY category;",
        [assignmentId]
      );
      for (let row of midvotes) {
        ratings[row.category] = {
          ...ratings[row.category],
          midvotes: row.count,
        };
      }

      const downvotes = await this.pool.query(
        "SELECT COUNT(*) as count, category FROM Ratings " +
          "WHERE assignment_id=? AND score=-1 " +
          "GROUP BY category;",
        [assignmentId]
      );
      for (let row of downvotes) {
        ratings[row.category] = {
          ...ratings[row.category],
          downvotes: row.count,
        };
      }
      return { ratings };
    } catch (e) {
      console.error("db.getAssignmentInfo error: ", e);
      throw e;
    }
  }

  // Updates the course with the given courseId to have the given title
  async editCourse(courseId, title) {
    try {
      const output = this.pool.query("UPDATE Classes SET title=? WHERE id=?;", [
        title,
        courseId,
      ]);
      return output;
    } catch (e) {
      console.error("db.editAssignment error: ", e);
      throw e;
    }
  }

  // Updates the student with the given studentId to have the given first and last names
  async editStudent(studentId, { first_name, last_name }) {
    try {
      const output = this.pool.query(
        "UPDATE Students SET first_name=?, last_name=? WHERE id=?;",
        [first_name, last_name, studentId]
      );
      return output;
    } catch (e) {
      console.error("db.editAssignment error: ", e);
      throw e;
    }
  }

  // Updates the assignment with the given assignmentId to have the given title
  async editAssignment(assignmentId, title) {
    try {
      const output = this.pool.query(
        "UPDATE Assignments SET title=? WHERE id=?;",
        [title, assignmentId]
      );
      return output;
    } catch (e) {
      console.error("db.editAssignment error: ", e);
      throw e;
    }
  }

  // Returns a boolean indicating whether the student with id=author_id has already rated the
  // assignment with id=assignment_id in the given category
  async isRated(author_id, assignment_id, category) {
    try {
      // Check if rating already exists in database
      let results = await this.pool.query(
        "SELECT * FROM Ratings WHERE author_id = ? AND assignment_id = ? AND category = ?",
        [author_id, assignment_id, category]
      );

      // If there are results, rating already exists
      return results.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Updates rating with given author_id, assignment_id, and category to have given score
  async updateRating(score, author_id, assignment_id, category) {
    try {
      await this.pool.query(
        "UPDATE Ratings SET score = ? WHERE author_id = ? AND assignment_id = ? AND category = ?",
        [score, author_id, assignment_id, category]
      );
    } catch (error) {
      throw error;
    }
  }

  // Returns a boolean indicating whether the student with id=student_id has already voted on the
  // comment with id=comment_id
  async hasVoted(student_id, comment_id) {
    try {
      // Check if rating already exists in database
      let results = await this.pool.query(
        "SELECT * FROM Votes WHERE student_id = ? AND comment_id = ?",
        [student_id, comment_id]
      );

      // If there are results, rating already exists
      return results.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Updates vote with given student_id and comment_id to have given value
  async updateVote(student_id, comment_id, value) {
    try {
      await this.pool.query(
        "UPDATE Votes SET value = ? WHERE student_id = ? AND comment_id = ?",
        [value, student_id, comment_id]
      );
    } catch (error) {
      throw error;
    }
  }

  // Get the total votes for a comment
  async getVoteSum(comment_id)
  {
    try
    {
      const votesum = await this.pool.query("SELECT SUM(value) FROM Votes WHERE comment_id = ?",[comment_id]);
      console.log(votesum)
      return {votesum}
    }
    catch (error)
    {
      throw error
    }
  }
}

module.exports = db;
