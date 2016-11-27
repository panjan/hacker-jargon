const HNAPI = require('./hacker-news-api');

function topWords(text) {
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
  HNAPI.getNewStoryIds()
    .then((ids) => HNAPI.getTitles(ids.slice(0, 25)))
    .then((titles) => res.send(topWords(titles.join(' '))));
};

exports.inPostTitles = (res) => {
  res.send({ words: ['foo', 'bar'] });
};

exports.inHighKarmaStoryTitles = (res) => {
  res.send({ words: ['foo', 'bar'] });
};
