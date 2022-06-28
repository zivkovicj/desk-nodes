const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();

const { students, topics, scores } = require('./data.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

app.use(express.static('Public'));

app.get('/students', (req, res) => {
  pool.query('SELECT * FROM students ORDER BY last_name', (error, results) => {
    if (error) {
      throw error
    }

    const student_data = results.rows;
    const data_length = Math.ceil(student_data.length / 2);
    const group_1 = student_data.splice(0, data_length);

    res.render('students', { group_1: group_1, group_2: student_data });
  })
});

app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('SELECT * FROM students WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    const this_stud = results.rows[0];
    res.render('student', {this_stud: this_stud});
  })
})

app.post('/students', (req, res) => {
  const { first_name, last_name } = req.body

  pool.query(
    'INSERT INTO students (first_name, last_name) VALUES ($1, $2)',
    [first_name, last_name],
    (error) => {
      if (error) {
        throw error
      }
      res.redirect('students');
    }
  );
});

app.post('/students/update', (req, res) => {
  const id = parseInt(req.body.id);
  const { first_name, last_name } = req.body

  pool.query(
    'UPDATE students SET first_name = $1, last_name = $2 WHERE id = $3', [first_name, last_name, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect('../students');
    }
  )
})

app.post('/students/delete', (req, res) => {
  const id = parseInt(req.body.id);

  pool.query(
    'DELETE FROM students WHERE id = $1', [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).json({ status: 'success', message: `Student deleted where id = ${id}.` });
    }
  )
})


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