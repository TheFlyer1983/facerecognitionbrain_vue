import { vi } from 'vitest';

global.console = {
  error: vi.fn()
};
