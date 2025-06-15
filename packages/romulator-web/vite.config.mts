import {
  ZViteConfigBuilder,
  ZViteServerBuilder,
} from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const server = new ZViteServerBuilder().dev().build();
const config = new ZViteConfigBuilder().react().server(server).lodash().build();
export default defineConfig(config);
