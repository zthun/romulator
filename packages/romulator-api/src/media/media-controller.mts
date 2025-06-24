import { Controller, Get } from "@nestjs/common";

@Controller("media")
export class ZRomulatorMediaController {
  @Get()
  public list() {
    return Promise.reject("Not implemented yet");
  }
}
