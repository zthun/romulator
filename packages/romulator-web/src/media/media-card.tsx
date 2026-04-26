import {
  useCss,
  ZCard,
  ZIconFontAwesome,
  ZImage,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css, cssJoinDefined, ZOrientation } from "@zthun/helpful-fn";
import {
  ZRomulatorGameMediaType,
  type ZRomulatorMediaType,
  ZRomulatorSystemMediaType,
} from "@zthun/romulator-client";

import { useMediaService } from "./media-service.js";

// TODO: Localization
const ZRomulatorMediaTypeName: Record<ZRomulatorMediaType, string> = {
  [ZRomulatorGameMediaType.BackCover]: "Back Cover",
  [ZRomulatorGameMediaType.Box3d]: "3D Box",
  [ZRomulatorGameMediaType.Cover]: "Cover",
  [ZRomulatorGameMediaType.FanArt]: "Fan Art",
  [ZRomulatorGameMediaType.Manual]: "Manual",
  [ZRomulatorGameMediaType.Marquee]: "Marquee",
  [ZRomulatorGameMediaType.PhysicalMedia]: "Physical Media",
  [ZRomulatorGameMediaType.Screenshot]: "Screenshot",
  [ZRomulatorGameMediaType.Title]: "Title",
  [ZRomulatorGameMediaType.Video]: "Video",
  [ZRomulatorSystemMediaType.Controller]: "Controller",
  [ZRomulatorSystemMediaType.Picture]: "System Picture",
  [ZRomulatorSystemMediaType.Wheel]: "Wheel Logo",
};

// TODO: Localization
const ZRomulatorMediaTypeDescription: Record<ZRomulatorMediaType, string> = {
  [ZRomulatorGameMediaType.BackCover]: "Rear packaging artwork.",
  [ZRomulatorGameMediaType.Box3d]: "3D box render.",
  [ZRomulatorGameMediaType.Cover]: "Front cover art.",
  [ZRomulatorGameMediaType.FanArt]: "Community artwork.",
  [ZRomulatorGameMediaType.Manual]: "Digital version of the game manual.",
  [ZRomulatorGameMediaType.Marquee]: "Game Logo.",
  [ZRomulatorGameMediaType.PhysicalMedia]: "Disc or cartridge.",
  [ZRomulatorGameMediaType.Screenshot]: "In-game action.",
  [ZRomulatorGameMediaType.Title]: "Screen upon load.",
  [ZRomulatorGameMediaType.Video]: "Gameplay or trailer video preview.",
  [ZRomulatorSystemMediaType.Controller]: "Primary controller image.",
  [ZRomulatorSystemMediaType.Picture]: "Image of system hardware.",
  [ZRomulatorSystemMediaType.Wheel]: "Logo for the system.",
};

/**
 * Props for the media card.
 */
export interface IZRomulatorMediaCard {
  /**
   * The id of the game or system.
   */
  identifier: string;
  /**
   * The type of media to retrieve.
   */
  type: ZRomulatorMediaType;
}

export function ZRomulatorMediaCard(props: IZRomulatorMediaCard) {
  const { identifier, type } = props;
  const media = useMediaService();
  const src = media.url(identifier, type);

  const _className = useCss(css`
    & .ZRomulatorMediaCard-image-container {
      height: 20rem;
    }
  `);

  return (
    <ZCard
      className={cssJoinDefined("ZRomulatorMediaCard-root", _className)}
      name={type}
      TitleProps={{
        avatar: <ZIconFontAwesome name="image" width={ZSizeFixed.Medium} />,
        heading: ZRomulatorMediaTypeName[type],
        subHeading: ZRomulatorMediaTypeDescription[type],
      }}
      data-type={type}
      data-identifier={identifier}
    >
      <ZStack
        className="ZRomulatorMediaCard-image-container"
        orientation={ZOrientation.Horizontal}
        width={ZSizeVaried.Full}
        height={ZSizeVaried.Full}
        align={{ items: "center" }}
        justify={{ content: "center" }}
      >
        <ZImage
          src={src}
          width={ZSizeVaried.Full}
          height={ZSizeVaried.Full}
          fit="scale-down"
        />
      </ZStack>
    </ZCard>
  );
}
