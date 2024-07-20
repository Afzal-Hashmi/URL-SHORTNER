require("dotenv").config();
const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const { connectionDB } = require("./connection.js");
const PORT = 8080;
app.use(cookieparser());
connectionDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/urls", require("./routes/urls"));
app.use("/user", require("./routes/user"));

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server Started on Port: ${process.env.PORT || PORT}`)
);
