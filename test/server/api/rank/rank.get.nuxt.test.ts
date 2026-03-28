export {};

import { stubServerHandlerGlobals } from '../../../setupGlobals';

const loadHandler = async () =>
  (await import('../../../../server/api/rank/rank.get')).default;

describe('server/api/rank/rank.get', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubServerHandlerGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns emoji for valid rank', async () => {
    vi.stubGlobal(
      'getQuery',
      vi.fn(() => ({ rank: '2' }))
    );

    const handler = await loadHandler();
    const result = await handler({} as never);

    expect(result).toEqual({ input: '😀' });
  });

  it('returns the last emoji when rank exceeds bounds', async () => {
    vi.stubGlobal(
      'getQuery',
      vi.fn(() => ({ rank: '99' }))
    );

    const handler = await loadHandler();
    const result = await handler({} as never);

    expect(result).toEqual({ input: '🚀' });
  });

  it('throws bad request for invalid rank', async () => {
    vi.stubGlobal(
      'getQuery',
      vi.fn(() => ({ rank: 'not-a-number' }))
    );

    const handler = await loadHandler();
    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request'
    });
  });

  it('throws bad request for negative rank', async () => {
    vi.stubGlobal(
      'getQuery',
      vi.fn(() => ({ rank: '-1' }))
    );

    const handler = await loadHandler();
    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request'
    });
  });

  it('throws bad request for non-integer rank', async () => {
    vi.stubGlobal(
      'getQuery',
      vi.fn(() => ({ rank: '2.5' }))
    );

    const handler = await loadHandler();
    await expect(handler({} as never)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Bad Request'
    });
  });
});
