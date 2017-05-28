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
