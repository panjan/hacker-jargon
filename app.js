const topWords = require('./top-words');
const express = require('express');
const app = express();

// Top 10 most occurring words in the titles of the last 25 stories
app.get('/story-titles', function (req, res) {
  res.send({ words: topWords.inStoryTitles() });
});

// Top 10 most occurring words in the titles of the post of exactly the last week
app.get('/post-titles', function (req, res) {
  res.send({ words: topWords.inPostTitles() });
});

// Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma
app.get('/high-karma-stories', function (req, res) {
  res.send({ words: topWords.inHighKarmaStoryTitles() });
});

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});
