import dotenv from "dotenv";
dotenv.config({
  path: process.env.ENVIRONMENT ? `.env.${process.env.ENVIRONMENT}` : ".env",
});

export default {
  db: {
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    dbName: process.env.MONGO_DB || "georgia",
  },
};
