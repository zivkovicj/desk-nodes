const express = require('express');
const app = express();

const {students, topics, scores} = require('./data.js');
 
app.use(express.static('Public'));

app.get('/students', (req, res) => {
    console.log("Getting students in server");
    res.status(200).send(students);
});

app.get('/topics', (req, res) => {
  console.log("Getting topics in server");
  res.status(200).send(topics);
});

app.get('/scores', (req, res) => {
  console.log("Getting scores in server");
  res.status(200).send(scores);
});
 
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});