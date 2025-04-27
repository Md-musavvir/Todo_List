import app from "./app.js";
import connectDb from "./db/db.js";
import { configDotenv } from "dotenv";
connectDb()
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log("listening");
    });
  })
  .catch((err) => {
    console.log(err);
  });
