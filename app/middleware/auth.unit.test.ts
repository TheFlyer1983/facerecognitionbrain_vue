import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

const pinia = createTestingPinia({
  createSpy: vi.fn()
})

const mockUserStore = useUserStore(pinia)