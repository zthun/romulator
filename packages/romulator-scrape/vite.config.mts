import { ZViteConfigBuilder } from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const config = new ZViteConfigBuilder().cli().lodash().build();
export default defineConfig(config);
