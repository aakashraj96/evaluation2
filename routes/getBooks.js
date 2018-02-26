const https = require('https');
const Models = require('../models');


const getAllBooksData = () => {
  let api1Data = {};
  const promise = new Promise((resolve) => {
    https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (res) => {
      res.on('data', (data) => {
        api1Data = JSON.parse(data);
        resolve(api1Data);
      });
    });
  });
  return promise;
};


const booksGroupedByAuthor = api1Data => Array.from(api1Data.books).reduce((groups, item) => {
  const val = item.Author;
  const group = groups;
  group[val] = group[val] || [];
  group[val].push(item);
  return group;
}, {});

const groupByAuthor = api1Data => api1Data.reduce((groups, item) => {
  const val = item.author;
  const group = groups;
  group[val] = group[val] || [];
  group[val].push(item);
  return group;
}, {});


const getBookRatings = (api1Data) => {
  const promiseArray = api1Data.books.map(book => new Promise((resolve) => {
    https.get(`https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`, (response) => {
      response.on('data', (data2) => {
        resolve(JSON.parse(data2).rating);
      });
    });
  }));
  return promiseArray;
};


const mergeRatings = (api1Data, ratingsArray) => {
  for (let i = 0; i < api1Data.books.length; i += 1) {
    api1Data.books[i].ratings = ratingsArray[i];
  }
  return api1Data;
};

const insertBooks = allBookswithRatings => Models.books.destroy({ truncate: true }).then(() =>
  allBookswithRatings.books.map(element => Models.books.create({
    author: element.Author,
    id: element.id,
    name: element.Name,
    rating: element.ratings,
  })));

module.exports = [{
  path: '/getBooks',
  method: 'GET',
  handler: (request, reply) => {
    const promise = getAllBooksData();
    promise.then((api1Data) => {
      const promiseArray = getBookRatings(api1Data);
      Promise.all(promiseArray).then((ratingsArray) => {
        const allBookswithRatings = mergeRatings(api1Data, ratingsArray);
        const allBooksByAuthor = booksGroupedByAuthor(allBookswithRatings);
        reply(allBooksByAuthor);
      });
    });
  },
},
{
  method: 'POST',
  path: '/insertData',
  handler: (req, reply) => {
    console.log('insertDAta');
    const promise = getAllBooksData();
    promise.then((api1Data) => {
      const promiseArray = getBookRatings(api1Data);
      Promise.all(promiseArray).then((ratingsArray) => {
        const allBookswithRatings = mergeRatings(api1Data, ratingsArray);
        console.log('STATUS!!: ', allBookswithRatings);
        const insertPromiseArray = insertBooks(allBookswithRatings);
        console.log(insertPromiseArray);
        Promise.all(insertPromiseArray).then(() => {
          console.log('inside promise.all');
        });
        reply('success');
      });
    });
  },
},
{
  method: 'POST',
  path: '/like',
  handler: (req, reply) => {
    console.log(req.payload.bookid);
    Models.likes.destroy({
      where: {
        bookid: req.payload.bookid.toString(),
      },
    }).then(() => {
      Models.likes.create({
        bookid: req.payload.bookid.toString(),
        like: 1,
      }).then(reply('liked'));
    });
  },
},
{
  method: 'POST',
  path: '/dislike',
  handler: (req, reply) => {
    Models.likes.destroy({
      where: {
        bookid: req.payload.bookid.toString(),
      },
    }).then((data) => {
      Models.likes.create({
        bookid: req.payload.bookid.toString(),
        like: 0,
      }).then(reply('disliked'));
    });
  },
},
{
  method: 'GET',
  path: '/getBooksAndLikes',
  handler: (req, reply) => {
    console.log('Fired the route!');
    const likesArray = [];
    const promiseArray = [];
    Models.books.findAll().then((data) => {
      if (data.length === 0) {
        console.log('null response');
        reply({ msg: 'none here' });
      }
      let count = 0;
      const booksWithRatings = [];
      data.map((element, i) => {
        Models.likes.find({
          where: {
            bookid: element.dataValues.id.toString(),
          },
        }).then((likeData) => {
          console.log(likeData);
          likesArray[i] = likeData;
          if (likeData) {
            element.dataValues.like = likeData.like;
          } else {
            element.dataValues.like = 0;
          }
          console.log(element.dataValues);
          booksWithRatings.push(element);
          count++;
          if (count === data.length) {
            // reply.writeHead(200, { 'Content-Type': 'application/json' });
            reply(groupByAuthor(booksWithRatings));
          }
        });
      });
    });
  },
},
];
