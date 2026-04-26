import type { IZComponentValueReadonly } from "@zthun/fashion-boutique";
import {
  useFashionTheme,
  ZContentTitle,
  ZGrid,
  ZLabel,
  ZParagraph,
  ZStack,
  ZTile,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { formatDateTime } from "@zthun/helpful-fn";
import { type IZJob } from "@zthun/romulator-client";

import { useJobStatusMetadata } from "./use-job-status-metadata.js";
import { useJobTypeMetadata } from "./use-job-type-metadata.js";

export interface IZJobTile extends Required<IZComponentValueReadonly<IZJob>> {}

export function ZJobTile(props: IZJobTile) {
  const { value } = props;
  const { body } = useFashionTheme();
  const { status, percent, type, createdAt } = value;
  const created = formatDateTime(createdAt);

  const _type = useJobTypeMetadata(type);
  const { name, description, avatar } = _type;

  const _status = useJobStatusMetadata(status);

  return (
    <ZTile className="ZRomulatorJobTile-root" fashion={body} name={value.id}>
      <ZStack
        height={ZSizeVaried.Full}
        width={ZSizeVaried.Full}
        gap={ZSizeFixed.Large}
      >
        <ZContentTitle
          heading={name}
          subHeading={description}
          avatar={avatar}
          suffix={_status.avatar}
        />
        <ZGrid columns="auto 1fr" gap={ZSizeFixed.Small}>
          <ZLabel>Created:</ZLabel>
          <ZParagraph compact>{created}</ZParagraph>
          <ZLabel>Status</ZLabel>
          <ZParagraph compact>{_status.name}</ZParagraph>
          <ZLabel>Progress</ZLabel>
          <ZParagraph>{percent}%</ZParagraph>
        </ZGrid>
      </ZStack>
    </ZTile>
  );
}
