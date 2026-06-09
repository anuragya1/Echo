import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_CONNECTION_STRING ,
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  jwtExpire: "7d",
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET || "supersecret-refresh",
  refreshJwtExpire: process.env.REFRESH_JWT_EXPIRE || "30d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174"
};
