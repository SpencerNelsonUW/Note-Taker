//dependencies
const fs = require('fs'); 
const express = require('express');
const path = require('path');
const uuid = require('uuid');

const database = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

//linking
app.use(express.static('public'));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//HTML ROUTES
// GET route for homepage, this should open initially
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
//GET route for notes
app.get('/', (req, res) =>
  res.render(path.join(__dirname, '/public/notes.html'))
);

//
app.route('/api/notes').get(function(req, res){
  res.json(database);
});

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
  res.json(newNote);
})


//listening to set up the server.
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
