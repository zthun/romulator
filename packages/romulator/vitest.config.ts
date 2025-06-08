import { ZViteConfigBuilder } from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const config = new ZViteConfigBuilder()
  .test()
  .sourceMap()
  .minify(false)
  .build();
export default defineConfig(config);
