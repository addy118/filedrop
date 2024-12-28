const { Pool } = require("pg");
require("dotenv").config();

const { DATABASE_URL } = process.env;
module.exports = new Pool({ connectionString: DATABASE_URL });
