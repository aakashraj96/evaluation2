const https = require('https');

let api1Data = {};

module.exports = [{
  path: '/getBooks',
  method: 'GET',
  handler: (request, reply) => {
    const promise = new Promise((resolve) => {
      https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (res) => {
        res.on('data', (data) => {
          api1Data = JSON.parse(data);
          resolve('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/');
        });
      });
    });
    promise.then((data) => {
      const flag = 1;
      let count = 0;
      for (let i = 0; i < api1Data.books.length; i += 1) {
        https.get(data + api1Data.books[i].id, (response) => {
          response.on('data', (data2) => {
            api1Data.books[i].rating = JSON.parse(data2).rating;
            // console.log(api1Data.books[i]);
            count++;
            if (count === api1Data.books.length - 1) {
              const arr = Array.from(api1Data.books).reduce((groups, item) => {
                const val = item.Author;
                groups[val] = groups[val] || [];
                groups[val].push(item);
                return groups;
              }, {});
              reply(arr);
              console.log(arr);
            }
          });
        });
      }
    });
  },
}];
