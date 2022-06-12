const express = require('express');
const app = express();

const {students} = require('./data.js');
 
app.use(express.static('Public'));

app.get('/students', (req, res) => {
    console.log("Getting students in server");
    res.status(200).send(students);
});
 
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
  console.log(students);
});