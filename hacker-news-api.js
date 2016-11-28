const request = require('request');
const baseAddress = 'https://hacker-news.firebaseio.com/v0';

exports.getItem = (id) => {
  return new Promise((resolve, reject) => {
    request.get(
      `${baseAddress}/item/${id}.json`,
      (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
  });
};

exports.getItems = (ids) => {
  const titlePromises = [];
  for(let id of ids) {
    titlePromises.push(exports.getItem(id));
  }
  return Promise.all(titlePromises);
};

exports.getNewStoryIds = () => {
  return new Promise((resolve, reject) => {
    request.get(
      baseAddress + '/newstories.json',
      (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
  });
};

exports.getMaxItemId = () => {
  return new Promise((resolve, reject) => {
    request.get(
      baseAddress + '/maxitem.json',
      (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
  });
};

exports.getLastWeeksTitles = () => {
  return new Promise((resolve, reject) => {
    exports.getMaxItemId().then((id) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 14);
      walkItems(id, weekAgo)
        .then((items) => {
          const titles = [];
          for(item of items) {
            if(item.title) titles.push(item.title);
          }
          resolve(titles);
        });
    });
  });
};

function walkItems(id, targetTime) {
  return new Promise((resolve, reject) => {
    getManyItems(id, 100).then((items) => {
      const lastItemTime = new Date(items[items.length - 1].time * 1000);
      console.log('item time: ' + lastItemTime);
      console.log('target time: ' + targetTime);
      if (lastItemTime < targetTime) {
        const youngerItems = items.find((x) => x.time && new Date(x.time * 1000) < targetTime);
        resolve(youngerItems);
      } else {
        walkItems(id - 100, targetTime).then((result) => resolve(items.concat(result)));
      }
    });
  });
}

function getManyItems(id, count) {
  let currentId = id;
  const promises = [];
  while(currentId > id - count) {
    promises.push(exports.getItem(currentId));
    currentId--;
  }
  return Promise.all(promises);
}
