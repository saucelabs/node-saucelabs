import yargs from 'yargs';

import {run} from '../src/cli';

jest.mock('../src/index.js', () => {
  class SauceLabsMock {
    constructor(options) {
      this.options = options;
      this.listJobs = jest
        .fn()
        .mockReturnValue(Promise.resolve(options.returnValue));
    }
  }

  return SauceLabsMock;
});

test('should be able to execute a command', async () => {
  run();
  expect(yargs.usage).toHaveBeenCalledTimes(1);
  expect(yargs.epilog).toHaveBeenCalledTimes(1);
  expect(yargs.demandCommand).toHaveBeenCalledTimes(1);
  expect(yargs.help).toHaveBeenCalledTimes(1);
  expect(yargs.option).toHaveBeenCalledWith('user', {
    alias: 'u',
    name: 'user',
    description: 'your Sauce Labs username',
  });

  const [command, description, handler, cb] = yargs.command.mock.calls[3];
  expect(command).toContain('listJobs <username> [limit] [subaccounts]');
  expect(description).toBe('Get all of a users jobs');

  handler(yargs);
  expect(yargs.positional).toHaveBeenCalledWith('username', {
    describe: 'username',
    type: 'string',
  });
  expect(yargs.positional).toHaveBeenCalledWith('limit', {
    describe: 'Number of results to return',
    type: 'number',
    default: 50,
  });
  expect(yargs.positional).toHaveBeenCalledWith('subaccounts', {
    describe: 'Include subaccounts in list of jobs',
    type: 'boolean',
    default: false,
  });

  const params = {
    user: 'foobaruser',
    key: 'barfookey',
    region: 'eu',
    username: 'username-param',
    limit: 42,
    subaccounts: true,
    returnValue: 'some result',
  };
  const api = await cb(params);

  expect(api.options).toEqual({
    user: 'foobaruser',
    key: 'barfookey',
    region: 'eu',
  });
  expect(api.listJobs).toHaveBeenCalledWith('username-param', params);
});
