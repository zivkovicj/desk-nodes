const container = document.getElementById('container');
const fetchAllButton = document.getElementById("fetch-button-1");
const deskConsultantButton = document.getElementById("desk-consult-button-1");

import { consultAlgo } from "./consult-algo.js";

const renderTable = (students, topics, scores) => {
  container.innerHTML = "";
  const score_table = document.createElement('table');
  const topic_header_row = document.createElement('tr');
  const corner_cell = document.createElement('td');
  topic_header_row.appendChild(corner_cell);
  topics.forEach(topic => {
    const header_cell = document.createElement('th');
    header_cell.innerHTML = `${topic.name}`;
    topic_header_row.appendChild(header_cell);
  })
  score_table.appendChild(topic_header_row);
  students.forEach((student, i) => {
    const stud_row = document.createElement('tr');
    const stud_data = document.createElement('td');
    stud_data.innerHTML = `${student.first_name}`;
    stud_row.appendChild(stud_data);
    topics.forEach((topic, j) => {
      const score_cell = document.createElement('td');
      score_cell.innerHTML = scores[i][j];
      stud_row.appendChild(score_cell);
    })
    score_table.appendChild(stud_row);
  })
  container.appendChild(score_table);
}

deskConsultantButton.addEventListener('click', () => {
  consultAlgo();
})

fetchAllButton.addEventListener('click', () => {

  let students;
  let topics;
  let scores;

  fetch('/students')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      //renderError(response);
    }
  })
  .then(response => {
    students = response;
  })
  .then(() => {
    fetch('/topics')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        //renderError(response);
      }
    })
    .then(response => {
      topics = response;
    });
  })
  .then(() => {
    fetch('/scores')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        //renderError(response);
      }
    })
    .then(response => {
      scores = Array.from(response);
      renderTable(students, topics, scores);
    });
  })
});

