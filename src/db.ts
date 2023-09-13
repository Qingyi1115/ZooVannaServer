import { Sequelize } from "Sequelize";

const conn = new Sequelize(
  process.env.MYSQL_DB || "zoovanna",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
  },
);

export { conn };
