const request = require('request');
const baseAddress = 'https://hacker-news.firebaseio.com/v0';

exports.getTitle = (id) => {
  return new Promise((resolve, reject) => {
    request.get(
      `${baseAddress}/item/${id}.json`,
      (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body).title);
      });
  });
};

exports.getTitles = (ids) => {
  const titlePromises = [];
  for(let id of ids) {
    titlePromises.push(exports.getTitle(id));
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
