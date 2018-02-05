const Server = require('./server');

describe('Testing server', () => {
  test('Testing API 1 call', () => {
    const options = {
      method: 'GET',
      url: '/getBooks',
    };
    Server.inject(options, (result) => {
      console.log(result);
      expect(result.statusCode).toContain(false);
      // Models.users.destroy({ truncate: true });
    });
  });
});
