import {
  ZViteConfigBuilder,
  ZViteServerBuilder,
  ZViteTestBuilder,
} from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const test = new ZViteTestBuilder().browser().build();
const server = new ZViteServerBuilder().dev().build();
const config = new ZViteConfigBuilder()
  .react()
  .server(server)
  .test(test)
  .lodash()
  .plugin(nodePolyfills())
  .build();

export default defineConfig(config);
