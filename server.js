const fs = require("fs/promises");
​
const express = require("express");
const app = express();
​
const PORT = 3000;
​
// Parses the body of the request
// Places the data on `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
​
// Serves all of our files in public as static assets
app.use(express.static("public"));
​
//Home page will send index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
​
//When "Get Started" button is clicked, it will send the notes.html
app.get("/notes", function (req, res) {
  res.sendFile(__dirname + "/public/notes.html");
});
​
// GET - /api/notes
app.get("/api/notes", async function (req, res) {});
​
// POST - /api/notes
app.post("/api/notes", async function (req, res) {});
​
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);