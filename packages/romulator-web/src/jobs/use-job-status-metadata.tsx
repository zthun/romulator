import { ZIconFontAwesome } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import type { IZEnumInfo } from "@zthun/helpful-fn";
import { firstDefined, ZEnumInfoBuilder } from "@zthun/helpful-fn";
import { ZJobStatus } from "@zthun/romulator-client";
import { useMemo } from "react";

export function useJobStatusMetadata(status?: ZJobStatus) {
  const lookup = useMemo<Record<ZJobStatus, IZEnumInfo<ZJobStatus>>>(
    () => ({
      [ZJobStatus.Idle]: new ZEnumInfoBuilder(ZJobStatus.Idle)
        .name("Idle")
        .description("Waiting to start")
        .avatar(
          <ZIconFontAwesome name="hourglass-start" width={ZSizeFixed.Small} />,
        )
        .build(),

      [ZJobStatus.Canceled]: new ZEnumInfoBuilder(ZJobStatus.Canceled)
        .name("Canceled")
        .description("The job was canceled by the user or never finished")
        .avatar(<ZIconFontAwesome name="x-mark" width={ZSizeFixed.Small} />)
        .build(),

      [ZJobStatus.Failed]: new ZEnumInfoBuilder(ZJobStatus.Failed)
        .name("Failed")
        .description("Something went wrong with job")
        .avatar(
          <ZIconFontAwesome
            name="circle-exclamation"
            width={ZSizeFixed.Small}
          />,
        )
        .build(),

      [ZJobStatus.Running]: new ZEnumInfoBuilder(ZJobStatus.Running)
        .name("Running")
        .description("Job is currently processing")
        .avatar(
          <ZIconFontAwesome
            name="spinner"
            animation="spin"
            width={ZSizeFixed.Small}
          />,
        )
        .build(),

      [ZJobStatus.Success]: new ZEnumInfoBuilder(ZJobStatus.Success)
        .name("Success")
        .description("Job completed successfully")
        .avatar(<ZIconFontAwesome name="check" width={ZSizeFixed.Small} />)
        .build(),
    }),
    [],
  );

  return lookup[firstDefined(ZJobStatus.Idle, status)];
}
