const Server = require('./server');

describe('Testing server', () => {
  test('Testing API 1 call', () => {
    const options = {
      method: 'GET',
      url: '/getBooks',
    };
    Server.inject(options, (result) => {
      // console.log(result);
      expect(result.statusCode).toBe(200);
      // Models.users.destroy({ truncate: true });
    });
  });
  // test('Testing API 1 call', () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/getBooks',
  //   };
  //   Server.inject(options, (response) => {
  //     console.log(response.result.message);
  //     expect(response.result.message).toContain('Harry');
  //     // Models.users.destroy({ truncate: true });
  //   });
  // });
  test('Testing API 2 call', () => {
    const options = {
      method: 'GET',
      url: '/getBooks',
    };
    Server.inject(options, (response) => {
      console.log(response.result.message.rating);
      expect(response.result.message.rating).not.toBe(undefined);
      // Models.users.destroy({ truncate: true });
    });
  });
});
