require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.port | 5000;
const dbURI =
  "mongodb://slikful:slikfulDB@ac-z5kkpj2-shard-00-00.htmkpsz.mongodb.net:27017,ac-z5kkpj2-shard-00-01.htmkpsz.mongodb.net:27017,ac-z5kkpj2-shard-00-02.htmkpsz.mongodb.net:27017/flavor-fiesta?ssl=true&replicaSet=atlas-rea49q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(authRoutes);
