const express = require("express");
const students = express.Router();
const { pool } = require('../config');
const authorizedUser = require('./helpers')



students.get('/', (req, res) => {
    pool.query('SELECT * FROM students ORDER BY last_name', (error, results) => {
        if (error) {
            throw error
        }

        const student_data = results.rows;
        const data_length = Math.ceil(student_data.length / 2);
        const group_1 = student_data.splice(0, data_length);

        res.render('students', { group_1: group_1, group_2: student_data, user: req.session.user });//
    })
});


students.get('/:id', authorizedUser, (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM students WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }

        const this_stud = results.rows[0];
        res.render('student', { this_stud: this_stud });
    })
})



students.post('/', authorizedUser, (req, res) => {
    const { first_name, last_name } = req.body

    pool.query(
        'INSERT INTO students (first_name, last_name) VALUES ($1, $2) RETURNING id;',
        [first_name, last_name],
        (error, results) => {
            if (error) {
                throw error
            }
            const newest_id = results.rows[0].id;

            pool.query('SELECT * FROM topics', (err, results) => {
                if (err) throw err;
                const topics = results.rows;

                topics.forEach(topic => {
                    pool.query('INSERT INTO scores (student_id, topic_id) VALUES ($1, $2)',
                        [newest_id, topic.id],
                        (err, results) => {
                            if (err) throw err;
                        })
                });
                res.redirect('students');
            });

        }
    );
});

students.post('/update', authorizedUser, (req, res) => {
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

students.post('/delete', authorizedUser, (req, res) => {
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

module.exports = students;


