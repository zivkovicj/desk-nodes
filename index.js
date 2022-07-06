const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();

const { students, topics, scores } = require('./data.js');

const consultantsAlgo = require('./consult-algo.js');

const testaroo = require('./testaroo.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

app.use(express.static('Public'));

app.get('/desk-consultants', (req, res) => {
  
  pool.query('SELECT * FROM scores', (err, results1) => {
    if (err) throw err;

    let scores = results1.rows;

    pool.query('SELECT * FROM students ORDER BY last_name', (err, results2) => {
      if (err) throw err;

      let students = results2.rows;

      pool.query('SELECT * FROM topics', (err, results3) => {
        if (err) throw err;

        let topics = results3.rows;

        const groups = consultantsAlgo(students, topics, scores);
        

        res.render('desk-consultants', {students: students, topics: topics, scores: scores, groups: groups});

      })
    });
  });
});

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
    res.render('student', { this_stud: this_stud });
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
  let students = [];
  let topics = [];

  pool.query('SELECT * FROM scores', (err, results1) => {
    if (err) throw err;

    let parsed_scores = JSON.parse(JSON.stringify(results1.rows));

    pool.query('SELECT * FROM students ORDER BY last_name', (err, results2) => {
      if (err) throw err;

      students = results2.rows;

      pool.query('SELECT * FROM topics', (err, results3) => {
        if (err) throw err;

        topics = results3.rows;

        res.render('scores', { students: students, topics: topics, scores: parsed_scores });
      })

    });
  });
});

app.post('/scores/update', (req, res) => {
  const these_scores = req.body;

  Object.keys(these_scores).forEach(key => {
    const split_key = key.split('_');
    const studentId = parseInt(split_key[1]);
    const topicId = parseInt(split_key[2]);
    const points = parseInt(these_scores[key]);

    if (points) {
      pool.query(
        'UPDATE scores SET points = $3 WHERE student_id = $1 AND topic_id = $2',
        [studentId, topicId, points],
        (err, results) => { if (err) throw err; }
      );
    }
  });
  res.redirect('back');
})


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});