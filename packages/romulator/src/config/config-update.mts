import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmptyObject, IsObject } from "class-validator";

export class ZRomulatorConfigUpdateDto {
  @ApiProperty({ type: "object", properties: {} })
  @IsDefined({ message: "The contents of the config is required" })
  @IsObject({ message: "The contents of the config must be an object " })
  @IsNotEmptyObject()
  contents: Record<string, unknown>;
}
