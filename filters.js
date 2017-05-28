'use strict';

module.exports = {
  trim (value) {
    return value.toString().replace(/(\n|\t)/g, '');
  },
  exist (value) {
    return !!value;
  },
  getUrl (value) {
    const parse = /https?.+\.[A-Za-z]+/.exec(value);

    let url = '';
    if (
      Array.isArray(parse)
      &&
      'string' === typeof parse[0]
    ) {
      url = parse[0];
    }

    return url;
  },
  typeImage (value) {
    return value ? 'gif' : 'image';
  },
  parseMediaType (value) {
    if (/class="b-video"/.test(value)) {
      return 'video';
    }
    if (/class="b-gifx"/.test(value)) {
      return 'gif';
    }
    if (/^<a href=/.test(value)) {
      return 'image';
    }
    if (/<p/.test(value)) {
      return 'text';
    }
    return 'error';
  },
};
