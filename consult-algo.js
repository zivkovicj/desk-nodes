module.exports = (students, topics, scores) => {

  const findStudentsNeeding = () => {
    return topics.map(topic => {
      const scoresForThisTopic = scores.filter(score => {
        return (score.topic_id === topic.id) && ((score.points === null) || (score.points <= 70));
      })
      return [Math.ceil(scoresForThisTopic.length / 4), topic.id];
    });
  }

  const sortByNeed = (arr) => {
    return arr.slice().sort((a, b) => b[0] - a[0]);
  }

  const chooseInitialGroups = (topicsByConsultantsNeeded, consultantsNeeded) => {     
    const oneFourthOfClass = Math.ceil(students.length / 4);
    const groups = [];

    for (let i = 0; i < topicsByConsultantsNeeded.length; i++) {    // Using a for loop instead of forEach so that I'm allowed to break;
      const topic = topicsByConsultantsNeeded[i];
      const consultantsNeeded = topic[0];
      const topicId = topic[1];
      let consultantsForThisTopic = 0;
      const potentialConsultants = scores.filter(score => {
        return (score.topic_id === topicId) && (score.points !== null) && (score.points >= 70) && (needsPlacement.includes(score.student_id));
      })

      for (let j = 0; j < potentialConsultants.length; j++) {
        const consultant = potentialConsultants[j];
        groups.push([topicId, true, [consultant.student_id]]);           // The second element is a binary to indicate whether the first student in this groups is a consultant. 
        removeFromArray(needsPlacement, consultant.student_id);         
        consultantsForThisTopic++;
        if (consultantsForThisTopic > consultantsNeeded) { break; };        // Stop looking if this topic already has enough consultants assigned.
        if (groups.length >= oneFourthOfClass) { break; };                // Stop looking if the class has enough total consultants assigned.
      };
      if (groups.length >= oneFourthOfClass) { break; };                  // Stop looking if the class has enough total consultants assigned.  We do this in the inner loop and the outer loop for the corner cases where one passes and the other doesn't.
    }

    return groups;
  }

  const allocateStudents = (groups) => {
    for (let n = 0; n < 4; n++) {
      for (let i = 0; i < groups.length; i++) {
        const thisGroup = groups[i];
        const topic = thisGroup[0];
         const newStudScore = scores.find(score => {
          return (score.topic_id === topic) && ((score.points === null) || (score.points <= 70)) && (needsPlacement.includes(score.student_id))
        });
        if (newStudScore) {
          thisGroup[2].push(newStudScore.student_id);
          removeFromArray(needsPlacement, newStudScore.student_id);
        }
      }
    }
    return groups;
  }

  const assignSolitaryStudents = (allocatedGroups) => {
    for (var i = needsPlacement.length -1; i >= 0; i--) {
      
      const thisStudent = needsPlacement[i];
      let placed = false;

      // First, we check whether the solitary student can be placed into an existing group.
      // This step also increases the placement threshold to 90, so it might place some students who scored between 70 and 90, so they weren't placed on the first pass.
      // Some solitary students might be able to join the group started by the first solitary student.
      for (var j = 0; j < allocatedGroups.length; j++) {

        const thisGroup = allocatedGroups[j]; 

        if (thisGroup[2].length < 4) {

          const thisScore = scores.find(score => { return score.student_id === thisStudent && score.topic_id === thisGroup[0]});

          if (thisScore.points < 90 || thisScore.points == null) {    // Not equal to 90.
            thisGroup[2].push(thisStudent);
            removeFromArray(needsPlacement, thisStudent);
            placed = true;
          };
        };

      };

      // If still unplaced, create a new group with a new topic.
      if (!placed) {
        const newTopicScore = scores.find(score => {return score.student_id === thisStudent && (score.points === null || score.points <= 70)}); 
        if (newTopicScore) {
          const newGroup = [newTopicScore.topic_id, false, [thisStudent]];
          removeFromArray(needsPlacement, thisStudent);
          allocatedGroups.push(newGroup);
        }
      };
    };

    return allocatedGroups
  }

  const chunkGroups = (finalGroups) => {
    const chunkedGroups = [], size = 3;
    while (finalGroups.length > 0) {
      chunkedGroups.push(finalGroups.splice(0, size));
    }

    return chunkedGroups;
  }

  const removeFromArray = (arr, elem) => {
    const idx = arr.indexOf(elem);
    if (idx > -1) { // only splice array when item is found
      arr.splice(idx, 1); // 2nd parameter means remove one item only
    }
  }

  const needsPlacement = students.map(student => {return student.id});

  const consultantsNeeded = findStudentsNeeding();
  //console.log("consultantsNeeded");
  //console.log(consultantsNeeded);

  const topicsByConsultantsNeeded = sortByNeed(consultantsNeeded);
  //console.log("topicsByConsultantsNeeded");
  //console.log(topicsByConsultantsNeeded);

  const initialGroups = chooseInitialGroups(topicsByConsultantsNeeded, consultantsNeeded);
  //console.log("initialGroups");
  //console.log(initialGroups);

  const allocatedGroups = allocateStudents(initialGroups);
  //console.log("allocatedgroups");
  //console.log(allocatedGroups);

  const finalGroups = assignSolitaryStudents(allocatedGroups);

  const groupsIn3 = chunkGroups(finalGroups)

  return groupsIn3;
};
