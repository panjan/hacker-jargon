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

exports.getTitles = (ids) => {
  const titlePromises = [];
  for(let id of ids) {
    titlePromises.push(exports.getItem(id).title);
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
      weekAgo.setDate(weekAgo.getDate() - 7);
      const targetUnixTime = Math.floor(weekAgo.getTime()/1000);
      walkItems(id, targetUnixTime)
        .then((titles) => resolve(titles));
    });
  });
};

function walkItems(id, targetUnixTime) {
  return new Promise((resolve, reject) => {
    exports.getItem(id).then((item) => {
      console.log('targetUnixTime: ' + targetUnixTime);
      console.log('item.time: ' + item.time);
      console.log('item.title: ' + item.title);
      item.time < targetUnixTime ? resolve(id, targetUnixTime) : walkItems(id - 1, targetUnixTime).then((id) => resolve(id));
    });
  });
}
