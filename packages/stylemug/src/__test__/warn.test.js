import warn from '../warn';

global.console.warn = jest.fn();

it('should log a warning message', () => {
  warn('Something bad happened');
  expect(global.console.warn).toHaveBeenCalledWith(
    '[stylemug] Something bad happened'
  );
});
