'use strict';

const Xray = require('x-ray');
const filters = require('./filters');
const extractor = require('./extractor');
const formater = require('./formater');
const driver = require('./driver')('Windows-1251');


const x = Xray({ filters }).driver(driver);

function scrape (url) {
  return new Promise((resolve, reject) => {
    x(
      url,
      '.story',
      [{
        id: '@data-story-id',
        author: '.story__author',
        tags: ['.story__tags a | trim'],
        header: '.story__header-title a',
        nude: '.story__straw@class | exist',
        block: '.b-story-blocks__wrapper | exist',
        blocks: x('.b-story-block', [{
          type: extractor.type('.b-story-block__content@html'),
          gif: extractor.gif,
          text: extractor.text,
          image: extractor.image,
          video: extractor.video(x),
        }]),
        single: x('.story__wrapper > .b-story__content', {
          type: extractor.type('@html'),
          gif: extractor.gif,
          text: extractor.text,
          image: extractor.image,
          video: extractor.video(x),
        }),
      }]
    )((err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(formater(data));
    });
  });
}

// scrape('http://pikabu.ru/story/ta_strana_kotoraya_vzbuntuetsya_protiv_ssha_srazu_zhe_poluchaet_napadenie_igil_predannyikh_psov_pindyi_infowars_perevod_na_russkiy_yazyik_5083607')
// .then(data => console.log(JSON.stringify(data, null, 2)));

module.exports = scrape;
