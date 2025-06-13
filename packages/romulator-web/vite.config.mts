import { ZViteConfigBuilder } from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const config = new ZViteConfigBuilder().react().lodash().build();
export default defineConfig(config);
