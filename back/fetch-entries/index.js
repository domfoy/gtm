const {getEntries, storeEntries} = require('./lib');

fetchEntries();

async function fetchEntries() {
  const refs = await getEntries();

  // console.log(refs);
  console.log('test', refs);
  // await storeEntries(refs);
}
