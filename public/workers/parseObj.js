self.addEventListener('message', function(e) {

  a = new Date();
  console.log(a);
  let obj = JSON.parse(e.data.str);
  let queue = [];
  let resultArray = [];
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      queue.push(obj[i]);
    }
  } else {
    queue.push(obj);
  }

  while (queue.length > 0) {
    let tmpNode = queue.shift();
    resultArray.push(tmpNode.user);
    if (tmpNode.replies) {
      for (let i = 0; i < tmpNode.replies.length; i++) {
        queue.push(tmpNode.replies[i]);
      }
    }
  }
  resultArray.sort(function(a, b) {
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    return 0;
  });
  let i=0;
  while(i<resultArray.length) {
    if(resultArray[i] === resultArray[i+1])
      resultArray.splice(i,1);
    else 
      i++;
  }
  console.log(new Date()); 
  console.log( Math.floor((new Date().getTime() - a.getTime())/100)/10 + "s");
  self.postMessage(resultArray);

  }, false);