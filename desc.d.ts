import type { AxiosInstance } from "axios";

declare module '#app' {
  interface NuxtApp {
    $api: () => AxiosInstance;
  }
}
