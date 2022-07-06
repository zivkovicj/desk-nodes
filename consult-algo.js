module.exports = (students, topics, scores) => {

  // Transpose a matrix (used for scores) so that the rows are arranged by topic instead of student.
  function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  const findStudentsNeeding = () => {
    return topics.map(topic => {
      const scoresForThisTopic = scores.filter(score => {
        return (score.topic_id === topic.id) && ((score.points === null) || (score.points <= 70));
      })
      return [Math.ceil(scoresForThisTopic.length / 4), topic.id];
    });
  }

  const sortThenIndex = (arr) => {
    return arr.slice().sort((a, b) => b[0] - a[0]);
  }

  const chooseInitialGroups = (topicsByConsultantsNeeded, consultantsNeeded) => {
    let consultantsAssigned = [];                              // Holding the list of assigned students just for this function to prevent students from being double-booked
    const oneFourthOfClass = Math.ceil(students.length / 4);     // Find one-fourth of the class.
    const groups = [];

    for (let i = 0; i < topicsByConsultantsNeeded.length; i++) {    // Using a for loop instead of forEach so that I'm allowed to break;
      const topic = topicsByConsultantsNeeded[i];
      const consultantsNeeded = topic[0];
      const topicId = topic[1];
      let consultantsForThisTopic = 0;
      const potentialConsultants = scores.filter(score => {
        return (score.topic_id === topicId) && (score.points !== null) && (score.points >= 70) && !(consultantsAssigned.includes(score.student_id));
      })
      
      for (let j = 0; j < potentialConsultants.length; j++){
        const consultant = potentialConsultants[j];
        groups.push([topicId, true, [consultant.student_id]]);            // The second element is a binary to indicate whether the first student in this groups is a consultant.  
        consultantsAssigned.push(consultant.studentId);
        consultantsForThisTopic++;
        if (consultantsForThisTopic > consultantsNeeded) {break;};        // Stop looking if this topic already has enough consultants assigned.
        if (groups.length >= oneFourthOfClass) { break; };                // Stop looking if the class has enough total consultants assigned.
      };
      if (groups.length >= oneFourthOfClass) { break; };                  // Stop looking if the class has enough total consultants assigned.  We do this in the inner loop and the outer loop for the corner cases where one passes and the other doesn't.
    }

    return groups;
  }

  const allocateStudents = (groups) => {
    const alreadyAllocated = [];
    groups.forEach(group => {
      alreadyAllocated.push(group[2][0]);          // Mark the consultants as already allocated.
    })

    for (let n = 0; n < 4; n++){
      for (let i = 0; i < groups.length; i++) {
        const thisGroup = groups[i];  
        const topic = thisGroup[0];
        const newStudent = scores.find(score => {
          return (score.topic_id === topic) && (score.points === null) && (score.points <= 70) && !(alreadyAllocated.includes(score.student_id))
        })
        if (newStudent) {
          thisGroup[2].push(newStudent.student_id);
          alreadyAllocated.push(newStudent.student_id);
        }
      }
    }
    return groups;
  }

  const consultantsNeeded = findStudentsNeeding();
  console.log("consultantsNeeded");
  console.log(consultantsNeeded);

  const topicsByConsultantsNeeded = sortThenIndex(consultantsNeeded);
  console.log("topicsByConsultantsNeeded");
  console.log(topicsByConsultantsNeeded);

  const initialGroups = chooseInitialGroups(topicsByConsultantsNeeded, consultantsNeeded);
  console.log("initialGroups");
  console.log(initialGroups);

  const allocatedGroups = allocateStudents(initialGroups);
  console.log("allocatedgroups");
  console.log(allocatedGroups);

  return allocatedGroups;
};
