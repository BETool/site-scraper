'use strict';

const Xray = require('x-ray');
const filters = require('./filters');
const driver = require('./driver')('Windows-1251');


const x = Xray({ filters }).driver(driver);
const URL = 'http://pikabu.ru/story/_';
const extractor = {
  gif: {
    src: 'a@href',
    preview: '.b-gifx__image@src',
  },
  image: 'a@href',
  text: ['p | trim'],
  video: x('.b-video', {
    url: '@data-url',
    preview: '.b-video__preview@style | getUrl',
  }),
};


function scrape (counter) {
  return new Promise((resolve, reject) => {
    x(
      `${URL}${counter}`,
      '.story',
      [{
        id: '@data-story-id',
        author: '.story__author',
        tags: ['.story__tags a | trim'],
        header: '.story__header-title a',
        nude: '.story__straw@class | exist',
        block: '.b-story-blocks__wrapper | exist',
        blocks: x('.b-story-block', [{
          gif: extractor.gif,
          text: extractor.text,
          image: extractor.image,
          video: extractor.video,
          type: '.b-story-block__content@html | trim | parseMediaType',
        }]),
        single: x('.story__wrapper > .b-story__content', {
          gif: extractor.gif,
          text: extractor.text,
          image: extractor.image,
          video: extractor.video,
          type: '@html | trim | parseMediaType',
        }),
      }]
    )((err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = scrape;
