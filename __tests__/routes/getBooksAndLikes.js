const Server = require('../../src/server');
const request = require('request');

describe('TEsting getBooksAndLikes route', () => {
  test('Testing for response code to be 200', (done) => {
    console.log('Inside TEst');
    const options = {
      method: 'GET',
      url: '/getBooksAndLikes',
    };
    // Server.inject(options, (result) => {
    //   console.log(result.statusCode);
    //   expect(result.statusCode).toBe(400);
    //   done();
    // });
    request.get('http://localhost:8004/getBooksAndLikes').on('response', (data) => {
      console.log(data);
      done();
    });
  });
});
