import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

import connectDb from "./db/db.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening");
    });
  })
  .catch((err) => {
    console.log(err);
  });
