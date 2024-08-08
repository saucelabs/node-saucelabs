import {builder, handler} from '../../src/commands/sc';

jest.mock('../../src/index', () => {
  class SauceLabsMock {
    constructor() {
      this.scStarted = false;
      this.startSauceConnect = jest.fn(() => {
        this.scStarted = true;
        return this;
      });
    }
  }

  return SauceLabsMock;
});

test('builder', () => {
  const yargs = {option: jest.fn()};
  builder(yargs);
  expect(yargs.option).toBeCalledWith('tunnel-name', expect.any(Object));
});

test('handler', async () => {
  const api = await handler({region: 'eu'});
  expect(api.scStarted).toBe(true);
  expect(api.startSauceConnect).toBeCalledWith({region: 'eu'}, true);
});
