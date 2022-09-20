//dependencies
const fs = require('fs'); 
const path = require("path");
const express = require('express');

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
//route to read the `db.json` file and return all saved notes as JSON.
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
  database.push(newNote)
  fs.writeFile(jsonFile, JSON.stringify(database), function (err) {
    if (err){
      return console.log(err);
    }
    console.log("note saved succesfully")
  })
  res.json(newNote)
})


//listening to set up the server.
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
