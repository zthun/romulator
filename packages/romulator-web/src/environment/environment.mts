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

  public api(url: string) {
    this._env.api = url;
    return this;
  }

  public build() {
    return structuredClone(this._env);
  }
}
