import { ZViteConfigBuilder } from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const config = new ZViteConfigBuilder().test().build();
export default defineConfig(config);
