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
    .then((ids) => HNAPI.getItems(ids.slice(0, 25)))
    .then((items) => {
      const titles = items.map((x) => x.title);
      const words = topWords(titles.join(' '));
      res.send(words);
    })
    .catch((error) => res.send(500, error));
};

exports.inPostTitles = (res) => {
  res.send(500, { error: 'not implemented' });
  HNAPI.getLastWeeksTitles()
    .then((titles) => res.send({ words: titles }));
};

exports.inHighKarmaStoryTitles = (res) => {
  res.send(500, { error: 'not implemented' });
  res.send({ words: ['foo', 'bar'] });
};
