'use strict';

const sa = require('superagent');
require('superagent-charset')(sa);
require('superagent-proxy')(sa);


function driver (enc, proxy) {
  return function httpDriver (ctx, cb) {
    const pipe = sa.get(ctx.url);

    if (proxy) {
      pipe.proxy(proxy);
    }

    pipe
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36')
      .charset(enc)
      .set(ctx.headers)
      .end((err, res) => {
        if (err && !err.status) {
          return cb(err);
        }

        ctx.status = res.status;
        ctx.set(res.headers);
        ctx.body = ('application/json' === ctx.type ? res.body : res.text);
        ctx.url = (res.redirects.length ? res.redirects.pop() : ctx.url);

        return cb(null, ctx);
      });
  };
}

module.exports = driver;
