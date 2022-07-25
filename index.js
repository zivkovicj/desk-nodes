const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config');
var cookieParser = require('cookie-parser');
const session = require("express-session")

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();

const consultantsAlgo = require('./consult-algo.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
const store = new session.MemoryStore();
app.use(session({ 
  secret: "Shh, its a secret!",
  saveUninitialized: false,
  resave: false, 
}));


app.set('view engine', 'ejs');

app.use(express.static('Public'));

const studentsRouter = require("./routes/students");
app.use("/students", studentsRouter);



app.get("/login", (req, res) => {
  res.render("login");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (password == "Learning") {
    req.session.authenticated = true;
    req.session.user = { username, password };
    res.redirect("home")
  } else {
    res.status(403).json({ msg: "Bad Credentials" });
  }
})

app.get('/', (req, res) => {
  res.redirect('login')
})

app.get('/home', (req, res) => {
  res.render('home', {user: req.session.user});
})

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/login');
  });

});

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


        res.render('desk-consultants', { students: students, topics: topics, scores: scores, groups: groups, user: req.session.user });

      })
    });
  });
});

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

        res.render('scores', { students: students, topics: topics, scores: parsed_scores, user: req.session.user });
      })

    });
  });
});

const updateSingleScore = async (studentId, topicId, points) => {
  const dummy = await pool.query(
    'UPDATE scores SET points = $3 WHERE student_id = $1 AND topic_id = $2',
    [studentId, topicId, points],
    (err, results) => { if (err) throw err }
  );

}

app.post('/scores/update', async (req, res) => {
  const these_scores = req.body;

  Object.keys(these_scores).forEach(key => {
    const split_key = key.split('_');
    const studentId = parseInt(split_key[1]);
    const topicId = parseInt(split_key[2]);
    let points;
    if (these_scores[key]) {
      points = these_scores[key];
    } else {
      points = null;
    }

    updateSingleScore(studentId, topicId, points);
    /*
    const dummy = await pool.query(
      'UPDATE scores SET points = $3 WHERE student_id = $1 AND topic_id = $2',
      [studentId, topicId, points],
      (err, results) => { if (err) throw err }
    );
    */
  });
  res.redirect('back');
})


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;