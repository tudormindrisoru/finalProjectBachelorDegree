"use strict";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

//  const WEBSITE_URL = 'http://localhost:4200';
app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

const routes = require("./routes/routes");

// middlewares
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went wrong!",
  });
});

app.use(process.env.PHOTOS_DIR, express.static("photos"));
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
