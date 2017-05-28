'use strict';

const extractor = {
  gif: {
    src: 'a@href',
    preview: '.b-gifx__image@src',
  },
  image: 'a@href',
  text: ['p | trim'],
  video: (x) => {
    return x('.b-video', {
      url: '@data-url',
      preview: '.b-video__preview@style | getUrl',
    });
  },
  type: (selector => `${selector} | trim | parseMediaType`),
};

module.exports = extractor;
