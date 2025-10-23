import {
  ZViteConfigBuilder,
  ZViteServerBuilder,
  ZViteTestBuilder,
} from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const test = new ZViteTestBuilder().browser().build();
const server = new ZViteServerBuilder().dev().build();
const config = new ZViteConfigBuilder()
  .react()
  .server(server)
  .test(test)
  .lodash()
  .build();

export default defineConfig(config);
