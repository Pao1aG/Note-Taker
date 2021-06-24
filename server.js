const fs = require("fs/promises");

const express = require("express");
const app = express();

const PORT = 3000;

// Parses the body of the request
// Places the data on `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves all of our files in public as static assets
//This replaces the app.get for each of the files inside of the assets directory
app.use(express.static("public"));

//Home page will send index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

//When "Get Started" button is clicked, it will send the notes.html
app.get("/notes", function (req, res) {
  res.sendFile(__dirname + "/public/notes.html");
});

// GET - /api/notes
app.get("/api/notes", async function (req, res) {
    try {
         console.log("hello! im triggered (get)")
        const data = await fs.readFile("./db/db.json", "utf8");
        res.json(JSON.parse(data));
        //console.log("This is at the get" + data);//shows object within array in db.json
    } catch (err) {
        res.status(500).end("Server failed at get");
    }
});

// POST - /api/notes
app.post("/api/notes", async function (req, res) {
    try {
      console.log("hello! im triggered (post)")
        const newNote = req.body;
        console.log(newNote); //shows new object

        const data = await fs.readFile("./db/db.json", "utf8");
        //Parsing the data from json file, and then stringifying it 
        let str = JSON.stringify(JSON.parse(data));
        //Substring takes in the start and the end, and returns what's in-between
        // Starting at index 0, and then cutting off the ] at end
        console.log("str original: " + str)
        str = str.substring(0, str.length - 1);
        console.log("str after:    " + str)

        const stringNote = JSON.stringify(newNote);
        console.log("str note:     " + stringNote)
        // await fs.appendFile("./db/db.json", `${stringNote}, \n]`);
        console.log("str append:   " + `${str},${stringNote}]`)
        await fs.writeFile("./db/db.json", `${str},${stringNote}]`);


    } catch (err) {
        res.status(500).end("Server failed at post")
    }

    //NEED TO TRIGGER THE GET AGAIN

});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);