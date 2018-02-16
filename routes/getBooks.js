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
  groups[val] = groups[val] || [];
  groups[val].push(item);
  return groups;
}, {});


let getBookRatings = (api1Data) => {
  let promiseArray = api1Data.books.map((book)=>{
    return new Promise((resolve) => {
      https.get(`https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`, (response) => {
        response.on('data', (data2) => {
          resolve(JSON.parse(data2).rating);
        });
      });
    })
  });
  return promiseArray;
}


let mergeRatings = (api1Data, ratingsArray) => {
  for(let i=0;i<api1Data.books.length;i++)
  {
    api1Data.books[i].ratings = ratingsArray[i];
  }
  return api1Data;
}


module.exports = [{
  path: '/getBooks',
  method: 'GET',
  handler: (request, reply) => {
    const promise = getAllBooksData();
    promise.then((api1Data) => {
      let promiseArray = getBookRatings(api1Data);
      Promise.all(promiseArray).then((ratingsArray) => {
        let allBookswithRatings = mergeRatings(api1Data,ratingsArray);
        let allBooksByAuthor = booksGroupedByAuthor(allBookswithRatings);
        reply (allBooksByAuthor);
      });
    });
  },
},
{
  method: 'Get',
  path: '/insertData',
  handler: (req, reply) => {
    api1Data.books.forEach((element) => {
      Models.books.create({
        author: element.Author,
        bookid: element.id,
        name: element.Name,
        rating: element.rating,
      });
    });
  },
}];
