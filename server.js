//dependencies
const fs = require('fs'); 
const path = require("path");
const express = require('express');

const {v4 : uuidv4} = require('uuid')

const database = require('./db/db.json');

//setting up express app
const app = express();
//setting up the port to use
const PORT = process.env.PORT || 3001;

//use data held within the public directory
app.use(express.static('public'));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//ROUTES
// GET route for homepage, this should open initially
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
)
//GET route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
)

//GET route for database

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'));
});


//GET NOTES
app.route('/api/notes').get(function(req, res){
  res.json(database);
})

//Push new notes to database
app.route("/api/notes").post(function(req, res){
  let jsonFile = path.join(__dirname, '/db/db.json');
  let newNote = req.body;
  newNote.id = uuidv4();
  database.push(newNote)
  fs.writeFile(jsonFile, JSON.stringify(database), function (err) {
    if (err){
      return console.log(err);
    }
    console.log("note saved succesfully")
  })
  res.json(newNote)
})

app.delete("/api/notes/:id", function (req, res) {
  let jsonFile = path.join(__dirname, "/db/db.json");
  
  for (let i = 0; i < database.length; i++) {

      if (database[i].id == req.params.id) {
          database.splice(i, 1);
          break;
      }
  }

  fs.writeFileSync(jsonFile, JSON.stringify(database), function (err) {

    if (err) {
        return console.log(err);
    } else {
        console.log("Your note was deleted!");
    }
});
res.json(database);
});

//listening to set up the server.
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
