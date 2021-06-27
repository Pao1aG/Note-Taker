const fs = require("fs/promises");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

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
      const data = await fs.readFile("./db/db.json", "utf8");
      res.json(JSON.parse(data));
      // console.log(data);//shows object within array in db.json
  } catch (err) {
      res.status(500).end("Server failed at get");
  }
});

// POST - /api/notes
app.post("/api/notes/", async function (req, res) {
  try {
     const newNote = req.body;
     //Adding an id that equals the title of the note
     newNote.id = req.body.title;
    //  var newNote = {
    //    title: req.body.title,
    //    text: req.body.text,
    //    id: req.body.title
    //  };
      //console.log(newNote);

      const data = await fs.readFile("./db/db.json", "utf8");
      
      //because we begin with an empty array in db.json
      if (data.length > 2) {
        console.log("There are notes saved here")
        //Parsing the data from json file, and then stringifying it 
        let str = JSON.stringify(JSON.parse(data)); //found at t.ly/mscR
        // console.log("str original: " + str)
        //Substring takes in the start and the end, and returns what's in-between
        // Starting at index 0, and then cutting off the ] at end
        str = str.substring(0, str.length - 1);
        // console.log("str after:    " + str)
  
        // Making the newly added note into a string
        const stringNote = JSON.stringify(newNote);
        console.log("str note:     " + newNote.title)
  
        //Concatenating the old and new data
        console.log("str append:   " + `${str},${stringNote}]`)
        await fs.writeFile("./db/db.json", `${str},${stringNote}]`);
  
        res.send(); //need this to send to the frontend
       

      } else {
        console.log("This is the first saved note");

        const stringNote = JSON.stringify(newNote);
        await fs.writeFile("./db/db.json", `[${stringNote}]`);
        res.send();
      }

  } catch (err) {
      res.status(500).end("Server failed at post");
  }
});

// DELETE - /api/notes/:id 
app.delete("/api/notes/:id", async function (req, res) {
  const chosenNote = req.params.id; //title of note

  console.log("you are clicking delete btn: " + chosenNote)

  const savedNotes = await fs.readFile("./db/db.json", "utf8", function(err, data) {
    if(err) {
      console.log(err);
    }
    // JSON.parse(data)
  });
  
   const parsedNotes = JSON.parse(savedNotes);

  console.log("These are the saved notes in json " + savedNotes);
  console.log("Did it work?  " + parsedNotes[0].title)

  const newNotes = parsedNotes.filter(function (i) { //found on t.ly/Tclv
   //The i is an iterator, so i.title = object[0].title, object[1].title...
    return chosenNote !== i.title //returns only those objects whose title are not equal to chosenNote
  });

  console.log(newNotes);
  
  const sendNotes = JSON.stringify(newNotes);

  await fs.writeFile("./db/db.json", sendNotes);
  
  res.send();
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);