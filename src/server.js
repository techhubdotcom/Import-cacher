import express from 'express';
import fetch from 'node-fetch';
require('dotenv').config();
const bodyParser = require('body-parser');
const compress = require('compression');
const app = express();
const listenPort = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(compress());

const minutes = 5 * 60 * 1000;

let events = {};

function fetchEvents() {
  fetch('https://extraction.import.io/query/runtime/91c77516-f566-4500-bcb3-81c26aae3ac3?_apikey=e81503c3d3c941dbbb1fba0471a2ca95b4edd222c1ba2eed856af57b482a04a4403d6ccd90fcab1d10e692e6f2db24e893dd8e9c26e0e2a7a7f0339ec8f1d405c03288a40a34001f76d536738a9835fa&url=http%3A%2F%2Fwww.techhub.com%2Fevents', {
    method: 'GET',
    headers: {},
    timeout: 30000,
    compress: true,
  }).then((res) => {
    return res.json();
  }).then((data) => {
    const rows = data.extractorData.data[0].group.map((e) => {
      return {
        month: e['MONTH VALUE'][0].text,
        day: e['DAY NUMBER'][0].text,
        link: e['MONTH VALUE'][0].href,
        title: e['MEDIUMTITLE LINK'][0].text,
        where: e['COL VALUE'][0].text,
      };
    });
    events = rows;
  });
}

fetchEvents();
setInterval(fetchEvents, minutes);

app.get('/events', (req, res) => {
  res.json(events);
});

app.listen(listenPort, () => {
  console.log('Listening on port 3000!');
});
