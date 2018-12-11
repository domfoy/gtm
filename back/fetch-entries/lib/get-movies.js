const fs = require('fs');
const path = require('path');
const http = require('http');

const axios = require('axios'),
      cheerio = require('cheerio'),
      _ = require('lodash');

const IMDB_BASE_URL = 'https://www.imdb.com';

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 2
});

const request = axios.create({
  baseURL: IMDB_BASE_URL,
  timeout: 3000,
  httpAgent,
  headers: {
    'Accept-Language': 'en'
  }
});

module.exports = {
  getMovies,
  processMovie
};

const {refs: dataMovieRefs} = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/movie-refs-excerpt.json'), 'UTF-8'));
getMovies(dataMovieRefs);

async function getMovies(movieRefs) {
  const res = [];

  for (const movieRef of movieRefs) {
    console.log('process movie:', movieRef);
    try {
      const movieInfo = await processMovie(movieRef);
      res.push(movieInfo);
    } catch (err) {
      console.error(movieRef, ':', err);
    }
  }
  console.log('processing done');

  return res;
}

async function processMovie(movieRef) {
  const {data: page} =  await request(`/title/${movieRef}`);
  const parsedInfo = parsePage(page);
  const movieInfo = {...parsedInfo, ref: movieRef};

  if (!movieInfo.moreTagLinesLink) {
    return movieInfo;
  }

  const {data: tagLinesPage} = await request(movieInfo.moreTagLinesLink);
  const tagLines = parseTagLinesPage(tagLinesPage);

  return {...movieInfo, tagLines};
}

function parsePage(page) {
  const $ = cheerio.load(page);

  const title = $('h1').contents().first().text();
  const year = $('a', 'h1 #titleYear').text();
  const director = $('.credit_summary_item > h4:contains("Director:")').parent().children('a').text();
  const cast = $('tr > td:nth-child(2)', '.cast_list').map((i, e) => $(e).text()).get();

  const basicMovieInfo = _.mapValues({
    cast,
    director,
    title,
    year
  }, (o => trim(o)));

  const moreTagLinesLink = $('.txt-block > h4:contains("Taglines:")').parent().find('a').attr('href');

  if (!moreTagLinesLink) {
    const tagLine = trim($('.txt-block > h4:contains("Taglines:")').parent().contents().last().text());

    return {...basicMovieInfo, tagLines: [tagLine]};
  }

  return {...basicMovieInfo, moreTagLinesLink};
}

function trim(input) {
  if (_.isArray(input)) {
    return _.map(input, trimText);
  }

  return trimText(input);
}

function trimText(text) {
  return _.trim(text, ' \t\n\u00A0');
}

function parseTagLinesPage(page) {
  const $ = cheerio.load(page);

  const tagLines = $('.soda').map((i, e) => $(e).text()).get();

  return trim(tagLines);
}
