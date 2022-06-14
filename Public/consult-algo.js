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

    const findAllMedians = () => {
        topics.forEach((elem, i) => {
            const thisTopicScores = allScores.map(elem => {
                return elem[i];
            });
            const thisMed = median(thisTopicScores);
            topicMedians.push(thisMed);
        })
        console.log("topicMedians "+topicMedians);

        const sortThenIndex = (arr) => {
            const indArr = [];
            const sortedMedians = arr.slice().sort((a, b) => a - b);
            sortedMedians.forEach(elem => {
                const idx = topicMedians.indexOf(elem);
                indArr.push(idx);
                topicMedians[idx] = -1;
            })
            return indArr;
        }

        const topicsByPriority = sortThenIndex(topicMedians);
        console.log(topicsByPriority[0]);
    }

    // Establish these vars that will be used in several places in this algo
    let students;
    let topics;
    let scores;

    // Get median score for each topic
    let allScores;
    let topicMedians = [];

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
        findAllMedians();
      });
    })

};

export { consultAlgo };