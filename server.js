const express = require('express');
const app = express();

module.exports = app;

const student_collection = {
    {
        first_name: "Zee",
        last_name: "Zivkovic"
    },
    {
        first_name: "Domenick",
        last_name: "Dobbs"
    }
}

app.get('/students', (req, res, next) => {
    console.log("Getting students in server");
    res.send(student_collection);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});