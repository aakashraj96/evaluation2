const https = require('https');

module.exports = [{
  path: '/getBooks',
  method: 'GET',
  handler: (request, reply) => {
    // reply('success');
    let api1Data;
    https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (res) => {
      res.on('data', (data) => { api1Data = data.toString(); reply({ responseFromApi1: api1Data }); });
    });
  },
}];
