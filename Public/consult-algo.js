const consultAlgo = () => {

  // Transpose a matrix (used for scores) so that the rows are arranged by topic instead of student.
  function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  const sortThenIndex = (arr) => {
    const sortedArr = [];
    const arrCopy = arr.slice();
    const sortedTopics = arr.slice().sort((a, b) => b - a);

    sortedTopics.forEach(elem => {
      const idx = arrCopy.indexOf(elem);
      sortedArr.push(idx);
      arrCopy[idx] = -1;
    })
    return sortedArr;
  }

  const findStudentsNeeding = (scoresByTopic) => {
    return scoresByTopic.map(elem => {
      const studentsInNeed = elem.filter(j => {
        return j <= 70
      }).length
      return Math.ceil(studentsInNeed / 4);
    })
  }

  const chooseInitialGroups = (topicsByConsultantsNeeded, transposedScores, consultantsNeeded) => {
    const potentialConsultants = [];
    const consultantsAssigned = [];                                         // Holding the list of assigned students just for this function to prevent students from being double-booked
    const oneFourthOfClass = Math.ceil(transposedScores[0].length / 4);     // Find one-fourth of the class by counting the students who have scores for the first topic.  This approach could turn out to be problematic.
    const groups = [];

    transposedScores.forEach(topic => {
      const qualifiedForThisTopic = [];
      topic.forEach((score, i) => {
        if (score >= 70) {
          qualifiedForThisTopic.push(i);
        }
      })
      potentialConsultants.push(qualifiedForThisTopic);
    })

    for (let i = 0; i < topicsByConsultantsNeeded.length; i++) {
      const topic = topicsByConsultantsNeeded[i];
      let consultantsForThisTopic = 0;

      for (let j = 0; j < potentialConsultants[topic].length; j++){
        const student = potentialConsultants[topic][j];
        
        if (!consultantsAssigned.includes(student)) {
          consultantsAssigned.push(student);
          const thisGroup = [topic, true, [student]];                             // The second element is a binary to indicate whether the first student in this groups is a consultant.
          groups.push(thisGroup);
          consultantsForThisTopic++;
          if (consultantsForThisTopic >= consultantsNeeded[topic]) { break; };    // Stop looking if this topic already has enough consultants assigned.
          if (groups.length >= oneFourthOfClass) { break; };                      // Stop looking if the class has enough total consultants assigned.
        }
      }
      if (groups.length >= oneFourthOfClass) { break; };                          // Stop looking if the class has enough total consultants assigned.  We do this in the inner loop and the outer loop for the corner cases where one passes and the other doesn't.
    }

    return groups;
  }

  const allocateStudents = (groups, students, transposedScores) => {
    const alreadyAllocated = [];
    groups.forEach(group => {
      alreadyAllocated.push(group[2][0]);          // Mark the consultants as already allocated.
    })

    for (let n = 0; n < 4; n++){
      
      for (let i = 0; i < groups.length; i++) {
        const thisGroup = groups[i];  
        const groupIsFull = thisGroup[2].length >= 4
        if (groupIsFull) {continue;} ;  
        const thisGroupsTopic = thisGroup[0];

        for (let j = 0; j < students.length; j++) {
          const thisStudentId = students[j].id;
          if (alreadyAllocated.includes(thisStudentId)) { continue; }; 
          const studentNeedsThisTopic = transposedScores[thisGroupsTopic][thisStudentId] <= 70;
          if (studentNeedsThisTopic) {
            thisGroup[2].push(thisStudentId);
            alreadyAllocated.push(thisStudentId);
            break;
          }
        }
      }
    }
    
    return groups;
    
  }



  const completeConsultantAlgo = () => {
    const transposedScores = transpose(allScores);
    //console.log("Transposed Scores");
    //console.log(transposedScores);

    const consultantsNeeded = findStudentsNeeding(transposedScores);
    console.log("consultantsNeeded");
    console.log(consultantsNeeded);

    const topicsByConsultantsNeeded = sortThenIndex(consultantsNeeded);
    console.log("topicsByConsultantsNeeded");
    console.log(topicsByConsultantsNeeded);

    const initialGroups = chooseInitialGroups(topicsByConsultantsNeeded, transposedScores, consultantsNeeded);
    console.log("initialGroups");
    console.log(initialGroups);

    const allocatedGroups = allocateStudents(initialGroups, students, transposedScores);

    return allocatedGroups;
  }

  const renderGroups = (allocatedGroups, students, topics) => {
    const container = document.getElementById('container');
    container.innerHTML = "";
    
    allocatedGroups.forEach(group => {
      const thisDiv = document.createElement('div');
      thisDiv.className = "oneTable";
      const thisGroupTable = document.createElement('table');

      const topicName = topics.find(topic => topic.id === group[0]).name
      const topicNameCell = document.createElement('th');
      topicNameCell.innerHTML = topicName;
      thisGroupTable.appendChild(topicNameCell);

      const firstPair = [group[2][0],group[2][1]];
      const secondPair = [group[2][2],group[2][3]];

      const makeRow = (pair) => {
        pair.forEach(student_id => {
          if (student_id) {
            const studName = students.find(student => student.id === student_id).first_name;
            const studCell = document.createElement('td');
            studCell.innerHTML = studName;
            thisRow.appendChild(studCell);
          }
        })
        thisGroupTable.appendChild(thisRow);
      }

      let thisRow = document.createElement('tr');
      makeRow(firstPair);
      thisRow = document.createElement('tr');
      makeRow(secondPair);

      thisDiv.appendChild(thisGroupTable)
      container.appendChild(thisDiv);
    })

    
  }

  // Establish these vars that will be used in several places in this algo
  let students;
  let topics;
  let allScores;

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
      allScores = Array.from(response);
      const allocatedGroups = completeConsultantAlgo();
      renderGroups(allocatedGroups, students, topics);
    });
  })

};

export { consultAlgo };