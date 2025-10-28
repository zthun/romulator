import type { IZComponentName } from "@zthun/fashion-boutique";
import {
  ZCard,
  ZIconFontAwesome,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { ZOrientation } from "@zthun/helpful-fn";
import {
  ZRomulatorGameMediaType,
  ZRomulatorSystemMediaType,
  type ZRomulatorMediaType,
} from "@zthun/romulator-client";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";

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
  [ZRomulatorGameMediaType.Title]: "Title Screen",
  [ZRomulatorGameMediaType.Video]: "Video",
  [ZRomulatorSystemMediaType.Controller]: "Controller",
  [ZRomulatorSystemMediaType.Picture]: "System Picture",
  [ZRomulatorSystemMediaType.Wheel]: "Wheel Logo",
};

// TODO: Localization
const ZRomulatorMediaTypeDescription: Record<ZRomulatorMediaType, string> = {
  [ZRomulatorGameMediaType.BackCover]: "Rear artwork from the game packaging.",
  [ZRomulatorGameMediaType.Box3d]: "3D render showcasing the game box.",
  [ZRomulatorGameMediaType.Cover]: "Front cover art highlighting the game.",
  [ZRomulatorGameMediaType.FanArt]: "Community-created artwork for the game.",
  [ZRomulatorGameMediaType.Manual]: "Digital version of the game manual.",
  [ZRomulatorGameMediaType.Marquee]: "Arcade marquee graphic used on cabinets.",
  [ZRomulatorGameMediaType.PhysicalMedia]: "Disc or cartridge for the game.",
  [ZRomulatorGameMediaType.Screenshot]: "In-game action.",
  [ZRomulatorGameMediaType.Title]: "Screen when the game loads.",
  [ZRomulatorGameMediaType.Video]: "Gameplay or trailer video preview.",
  [ZRomulatorSystemMediaType.Controller]: "Primary controller image.",
  [ZRomulatorSystemMediaType.Picture]: "Image of system hardware.",
  [ZRomulatorSystemMediaType.Wheel]: "Logo for the system.",
};

/**
 * Props for the media card.
 */
export interface IZRomulatorMediaCard extends IZComponentName {
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
  const { name, identifier, type } = props;
  const { api } = new ZRomulatorEnvironmentBuilder().build();
  const id = `${identifier}-${type}`;
  const media = `${api}/media/${id}`;

  return (
    <ZCard
      className="ZRomulatorMediaCard-root"
      name={name}
      TitleProps={{
        avatar: <ZIconFontAwesome name="image" width={ZSizeFixed.Medium} />,
        heading: ZRomulatorMediaTypeName[type],
        subHeading: ZRomulatorMediaTypeDescription[type],
      }}
      data-type={type}
      data-identifier={identifier}
    >
      <ZStack
        orientation={ZOrientation.Horizontal}
        width={ZSizeVaried.Full}
        align={{ items: "center" }}
        justify={{ content: "center" }}
      >
        <ZImageSource src={media} width={ZSizeVaried.Full} />
      </ZStack>
    </ZCard>
  );
}
