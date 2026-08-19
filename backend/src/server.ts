import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import { connectDB } from "./config/db";
import app from "./app";

const PORT =
  process.env.PORT || 5000;

console.log(
  "OPENAI KEY:",
  process.env.OPENAI_API_KEY
    ? "FOUND"
    : "MISSING"
);

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
