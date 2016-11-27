const request = require('request');

const baseAddress = 'https://hacker-news.firebaseio.com/v0';

function getTitle(id) {
  return new Promise((resolve, reject) => {
    request.get(
      `${baseAddress}/item/${id}.json`,
      (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body).title);
      });
  });
}

function getTitles(storyIds) {
  const titlePromises = [];
  for(let id of storyIds) {
    titlePromises.push(getTitle(id));
  }
  return Promise.all(titlePromises);
}

function topWords(text) {
  const unique = Array.from(new Set(text.split(' ')));
  const frequencies = wordFrequency(text);
  const topWords = Object.keys(frequencies)
    .sort((a, b) => frequencies[b] - frequencies[a])
    .slice(0, 10);
  return { words: topWords };
}

// http://stackoverflow.com/a/30907349/2080939
function wordFrequency(string) {
  return string.replace(/[.]/g, '')
    .split(/\s/)
    .reduce((map, word) =>
            Object.assign(map, {
              [word]: (map[word])
                ? map[word] + 1
                : 1,
            }),
            {}
           );
}

exports.inStoryTitles = (res) => {
  request.get(
    baseAddress + '/newstories.json',
    (error, response, body) => {
      if (error) res.send(error);
      const ids = JSON.parse(body);
      getTitles(ids.slice(0, 25))
        .then((titles) => res.send(topWords(titles.join(' '))))
        .catch((err) => res.send(err));
    });
};

exports.inPostTitles = (res) => {
  res.send({ words: ['foo', 'bar'] });
};

exports.inHighKarmaStoryTitles = (res) => {
  res.send({ words: ['foo', 'bar'] });
};
