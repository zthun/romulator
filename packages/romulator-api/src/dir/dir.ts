import { homedir } from "node:os";
import { resolve } from "node:path";

export abstract class ZDir {
  public static application() {
    return resolve(homedir(), ".zthunworks", "romulator");
  }

  public static configs() {
    return resolve(ZDir.application(), "configs");
  }
}
