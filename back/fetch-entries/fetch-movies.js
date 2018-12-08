
function parseTag(res) {
  const $ = cheerio.load(res.data);

  const tag = $('div.txt-block > h4.inline').filter((i, el) => el.children[0].data === 'Taglines:');

  const tagLine = tag;
  console.log(tag);
}
