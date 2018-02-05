const https = require('https');

module.exports = [{
  path: '/getBooks',
  method: 'GET',
  handler: (request, reply) => {
    let api1Data = {};
    const promise = new Promise((resolve) => {
      https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (res) => {
        res.on('data', (data) => {
          api1Data = JSON.parse(data);
          resolve('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/');
        });
      });
    });
    promise.then((data) => {
      let flag = 1;
      for (let i = 0; i < api1Data.books.length; i += 1) {
        https.get(data + api1Data.books[i].id, (response) => {
          response.on('data', (data2) => {
            api1Data.books[i].rating = JSON.parse(data2).rating;
            // console.log(api1Data.books[i]);
            if (flag == 1) {
              flag = 0;
              // reply({ responseFromApi1: ap1Data.books[i] });
              reply({ message: api1Data.books[i] });
            }
          });
        });
      }
    });
  },
}];
