import {
  ZViteConfigBuilder,
  ZViteTestBuilder,
} from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const test = new ZViteTestBuilder().browser().istanbul().build();
const config = new ZViteConfigBuilder().test(test).build();
export default defineConfig(config);
