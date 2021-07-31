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
        console.error(
          "Error in connected database configuration: ",
          pingErr.message
        );
        return false;
      }
    } catch (connectionErr) {
      console.error(
        "Error establishing database connection: ",
        connectionErr.message
      );
      return false;
    }
  }

  async getClasses() {
    try {
      const classes = await this.pool.query("SELECT * FROM Classes;");
      return classes;
    } catch (e) {
      console.log("getClasses error: ", e);
      throw e;
    }
  }
}

module.exports = db;
