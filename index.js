const express = require('express');
const app = express();

const {students} = require('./data.js');
 
app.use(express.static('Public'));

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello, world!')
    .end();
});
 
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
  console.log(students);
});