'use strict';

function formater (data) {
  const posts = data.map((post) => {
    const formated = Object.assign(
      {},
      {
        id: post.id,
        author: post.author,
        tags: post.tags,
        header: post.header,
        nude: post.nude,
        date: new Date(),
      }
    );

    if (post.block) {
      formated.data = post.blocks.map((block) => {
        const type = block.type;
        return {
          type,
          [type]: block[type],
        };
      });
    } else {
      formated.data = [{
        type: post.single.type,
        [post.single.type]: post.single[post.single.type],
      }];
    }

    return formated;
  });

  return posts;
}


module.exports = formater;
