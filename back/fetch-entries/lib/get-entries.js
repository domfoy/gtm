const http = require('http');

const axios = require('axios'),
      cheerio = require('cheerio'),
      _ = require('lodash');

const IMDB_HOST_URL = 'https://www.imdb.com';

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 2
});

const request = axios.create({
  baseURL: `${IMDB_HOST_URL}`,
  timeout: 3000,
  httpAgent
});

module.exports = {
  getEntries,
  parseListPage
};
main();

async function main() {
  const movieRefs = await getEntries();

  console.log(movieRefs);
}

async function getEntries() {
  const url = imdbTemplateUrl();
  console.log('get first page:', url);
  const {data: page} = await request(imdbTemplateUrl());

  return processPages(page);
}

async function processPages(page, movieRefs = []) {
  console.log('process page');
  const {next, pageMovieRefs} = parseListPage(page);

  console.log('parsed movie refs:', pageMovieRefs.length);
  _.forEach(pageMovieRefs, movieRef => movieRefs.push(movieRef));

  if (!next) {
    console.log('total movie refs:', movieRefs.length);
    return movieRefs;
  }
  console.log('get next page:', next);
  const {data: nextPage} = await request(next);

  return processPages(nextPage, movieRefs);
}

function parseListPage(page) {
  const $ = cheerio.load(page);

  const next = $('.desc > .lister-page-next', '.nav').attr('href');

  const pageMovieRefs = _(
    $('.lister-list > .lister-item.mode-simple')
      .map((i, el) => {
        const test = $(el).find('.lister-item-image a').attr('href');
        return test;
      })
  )
    .map(href => /\/title\/(.*)\/.*/.exec(href)[1])
    .filter()
    .value();

  return {
    pageMovieRefs,
    next
  };
}

function imdbTemplateUrl(queryParams = {}) {
  const defaultParams = {
    numVotes: 50000,
    releaseDateStart: '2000-01-01',
    releaseDateEnd: '',
    userRatingStart: '7.5',
    userRatingEnd: ''
  };

  const {
    numVotes,
    releaseDateStart,
    releaseDateEnd,
    userRatingStart,
    userRatingEnd
  } = _.defaults(queryParams, defaultParams);

  return `/search/title?title_type=feature\
&release_date=${releaseDateStart},${releaseDateEnd}\
&user_rating=${userRatingStart},${userRatingEnd}\
&num_votes=${numVotes},\
&view=simple\
&sort=year,asc\
&count=250`;
}
