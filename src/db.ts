import { Sequelize } from "Sequelize";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" }); // For my laptop

const conn = new Sequelize(
  process.env.MYSQL_DB || "zoovanna",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    logging: ["TRUE", "true", "True", "1"].includes(
      process.env.SQL_VERBOSE || "",
    ),
  },
);

export { conn };
