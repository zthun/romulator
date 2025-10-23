import {
  ZViteConfigBuilder,
  ZViteTestBuilder,
} from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const test = new ZViteTestBuilder().node().build();
const config = new ZViteConfigBuilder().nest().test(test).build();

export default defineConfig(config);
