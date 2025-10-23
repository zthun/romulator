import { ZUrlBuilder } from "@zthun/webigail-url";

export interface IZRomulatorEnvironment {
  api: string;
}

export class ZRomulatorEnvironmentBuilder {
  private _env: IZRomulatorEnvironment;

  public constructor() {
    this._env = {
      api: new ZUrlBuilder()
        .protocol("http")
        .hostname("localhost")
        .port(3000)
        .append("api")
        .build(),
    };
  }

  public build() {
    return structuredClone(this._env);
  }
}
