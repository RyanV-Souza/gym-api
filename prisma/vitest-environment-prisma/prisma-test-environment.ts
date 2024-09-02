import { Environment } from "vitest/environments";

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    console.log("oi");

    return {
      async teardown() {
        console.log("tearing down");
      },
    };
  },
};
