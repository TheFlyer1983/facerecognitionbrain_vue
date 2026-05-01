export const stubServerHandlerGlobals = (): void => {
  vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
  vi.stubGlobal('createError', (err: unknown) => err);
};
