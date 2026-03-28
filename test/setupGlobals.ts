export const stubServerHandlerGlobals = () => {
  vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
  vi.stubGlobal('createError', (err: unknown) => err);
};
