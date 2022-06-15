const consultAlgo = () => {

  // Function for finding the median of an array
  const median = (numbers) => {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  }

  // Transpose a matrix (used for scores) so that the rows are arranged by topic instead of student.
  function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  const sortThenIndex = (arr) => {
    const indArr = [];
    const sortedMedians = arr.slice().sort((a, b) => b - a);

    sortedMedians.forEach(elem => {
      const idx = arr.indexOf(elem);
      indArr.push(idx);
      arr[idx] = -1;
    })
    return indArr;
  }

  const findTopicMedians = (scoresByTopic) => {
    return scoresByTopic.map(elem => {
      return median(elem);
    })
  }

  const findStudentsNeeding = (scoresByTopic) => {
    return scoresByTopic.map(elem => {
      const studentsInNeed = elem.filter(j => {
        return j < 70
      }).length
      return Math.ceil(studentsInNeed / 4);
    })
  }

  const sortTopicsByConsultantsNeeded = (consultantsNeeded) => {

  }

  const chooseConsultants = (topicsByPriority, transposedScores, consultantsNeeded) => {
    const potentialConsultants = [];
    const actualConsultants = [];
    const actualTopics = [];
    
    transposedScores.forEach(topic => {
      const consultantsForThisTopic = [];
      topic.forEach((score, i) => {
        if (score >= 70) {
          consultantsForThisTopic.push(i);
        }
      })
      potentialConsultants.push(consultantsForThisTopic);
    })

    topicsByPriority.forEach(topic => {
      console.log("topic "+topic);
      console.log(potentialConsultants[topic]);
      actualConsultants.push(potentialConsultants[topic]);
      
    })
    
    console.log("actualConsultants ");
    console.log(actualConsultants);
    return potentialConsultants;
  }

  const completeConsultantAlgo = () => {
    const transposedScores = transpose(allScores);
    //console.log("Transposed Scores");
    //console.log(transposedScores);

    const topicMedians = findTopicMedians(transposedScores);
    //console.log("Find Topic Medians");
    //console.log(topicMedians);

    const topicsByPriority = sortThenIndex(topicMedians);
    console.log("topicsByPriority");
    console.log(topicsByPriority);

    const consultantsNeeded = findStudentsNeeding(transposedScores);
    console.log("consultantsNeeded");
    console.log(consultantsNeeded);

    const topicsByConsultantsNeeded = sortThenIndex(consultantsNeeded);
    console.log("topicsByConsultantsNeeded");
    console.log(topicsByConsultantsNeeded);

    const consultants = chooseConsultants(topicsByPriority, transposedScores);
    console.log("consultants");
    console.log(consultants);
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
      console.log(JSON.stringify(allScores));
      completeConsultantAlgo();
    });
  })

};

export { consultAlgo };