import { ZIconFontAwesome } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import type { IZEnumInfo } from "@zthun/helpful-fn";
import { firstDefined, ZEnumInfoBuilder } from "@zthun/helpful-fn";
import { ZJobType } from "@zthun/romulator-client";
import { useMemo } from "react";

export function useJobTypeMetadata(type?: ZJobType) {
  const _type = firstDefined(ZJobType.Unknown, type);
  const lookup: Record<ZJobType, IZEnumInfo<ZJobType>> = useMemo(
    () => ({
      [ZJobType.Unknown]: new ZEnumInfoBuilder(ZJobType.Unknown)
        .name("Unknown")
        .description("Invalid job")
        .avatar(<ZIconFontAwesome name="question" width={ZSizeFixed.Medium} />)
        .build(),

      [ZJobType.Ping]: new ZEnumInfoBuilder(ZJobType.Ping)
        .name("Ping")
        .description("Test the job framework")
        .avatar(
          <ZIconFontAwesome
            name="table-tennis-paddle-ball"
            width={ZSizeFixed.Medium}
          />,
        )
        .build(),

      [ZJobType.Scrape]: new ZEnumInfoBuilder(ZJobType.Scrape)
        .name("Scrape")
        .description("Retrieves all media and metadata for your games")
        .avatar(<ZIconFontAwesome name="image" width={ZSizeFixed.Medium} />)
        .build(),
    }),
    [],
  );

  return lookup[_type];
}
