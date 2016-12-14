/**
 * Import Ipsos Mori 2016 data
 */

const { readFileSync } = require('fs');
const { csvParseRows } = require('d3-dsv'); // eslint-disable-line import/no-extraneous-dependencies
const { resolve } = require('path');

module.exports = function parseIpsosCSV() {
  const csv = readFileSync(resolve(__dirname, 'perils-ipsos-2016.csv'), { encoding: 'utf8' });

  const parsed = csvParseRows(csv);

  return parsed.reduce((last, curr) => {
    const section = last[last.length - 1];
    if (curr.filter(d => d === '').length === curr.length) { // New section
      last.push([]);
    } else {
      section.push(curr);
    }

    return last;
  }, [[]])
  .filter(d => d.length)
  .map((d) => {
    const text = d[0].shift();
    const countries = (() => { d[1].shift(); return d[1]; })();
    let meta;
    let answers;

    if (['Median', 'Mean'].indexOf(d[2][0]) > -1) {
      const header = d[2].shift();
      const countryResults = d[2].reduce((last, curr, i) => {
        last[countries[i]] = curr;
        return last;
      }, {});

      meta = {
        [header]: countryResults,
      };

      answers = (() => { d[3].shift(); return d[3]; })()
        .reduce((last, curr, i) => {
          last[countries[i]] = curr;
          return last;
        }, {});
    } else { // Is survey question
      answers = d.filter(i => i.join('') !== '').slice(2);
    }


    return {
      text,
      answer: answers,
      options: null,
      meta,
    };
  });
};
