import axios from 'axios';
import cheerio from 'cheerio';

export default async function (query) {
  const url = `https://www.thesaurus.com/browse/${encodeURIComponent(query)}`;
  let req;

  try {
    req = await axios.get(url);
  } catch (err) {
    return { synonyms: [], antonyms: [] };
  }

  const $ = cheerio.load(req.data, { ignoreWhitespace: true });

  let synonyms = $(
    'body #loadingContainer #root div section div h2:contains("Synonyms for ")'
  )
    .parent()
    .find('ul li span a');
  synonyms = synonyms
    .map((_, element) => {
      return $(element).text();
    })
    .get();

  let antonyms = $(
    'body #loadingContainer #root div section div h2:contains("Antonyms for ")'
  )
    .parent()
    .find('ul li span a');
  antonyms = antonyms
    .map((_, element) => {
      return $(element).text();
    })
    .get();

  return {
    synonyms,
    antonyms,
  };
}
