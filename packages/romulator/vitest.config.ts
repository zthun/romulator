import { ZViteConfigBuilder } from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const config = new ZViteConfigBuilder(__dirname).test().build();
export default defineConfig(config);
