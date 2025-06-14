import {
  ZViteConfigBuilder,
  ZViteServerBuilder,
} from "@zthun/janitor-build-config/vite";
import { defineConfig } from "vite";

const server = new ZViteServerBuilder().dev().build();
const config = new ZViteConfigBuilder().web().server(server).lodash().build();

console.log(config.plugins?.map((p: any) => p?.name));
export default defineConfig(config);
