const container = document.getElementById('container');
const fetchAllButton = document.getElementById("fetch-button-1");

const printOutput = () => {
    container.innerHTML = "<p>Testing here</p>"
}


const renderStudents = (response) => {
    response.forEach(student => {
        const newStud = document.createElement('div');
        newStud.className = 'single-student';
        newStud.innerHTML = `<div class="student_name">${student.first_name}</div>
            <div class="student_name">- ${student.last_name}</div>`;
        container.appendChild(newStud);
    })
}

fetchAllButton.addEventListener('click', () => {
    console.log("Fetch Button Pressed");
    fetch('/students')
    .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          //renderError(response);
        }
      })
      .then(response => {
        renderStudents(response); 
      });
});


printOutput();