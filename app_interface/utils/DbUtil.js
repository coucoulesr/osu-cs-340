const mariadb = require("mariadb");

class db {
  constructor(poolOptions) {
    const pool = this.createPool(poolOptions);
    this.#testPool(pool).then((pass) => {
      if (pass) this.pool = pool;
    });
  }

  createPool(poolOptions) {
    return mariadb.createPool(poolOptions);
  }

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

  // Insert values into table
  async insert(table, values) {
    try {
      let query = "INSERT INTO " + table + " (";
      let queryParams = [];
      for (let key in values) {
        query += `${key}, `;
      }
      query = query.slice(0, query.length - 2);
      query += ")\nVALUES (";
      for (let key in values) {
        query += "?, ";
        queryParams.push(values[key]);
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
      console.error("db.insert error: ", e);
      throw e;
    }
  }

  // Get students in course by courseId
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

  // Get assignments in course by courseId
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

  async getAssignmentInfo(assignmentId) {
    try {
      const comments = await this.pool.query(
        "SELECT s.first_name, s.last_name, c.*, COUNT(v.value) AS votes, SUM(v.value) AS score FROM Comments c " +
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
      return { comments, ratings };
    } catch (e) {
      console.error("db.getCoursesWithStudent error: ", e);
      throw e;
    }
  }
}

module.exports = db;
