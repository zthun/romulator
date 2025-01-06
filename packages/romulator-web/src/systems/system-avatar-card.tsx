import {
  IZCard,
  ZCard,
  ZIconFontAwesome,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { ZOrientation } from "@zthun/helpful-fn";
import { IZRomulatorSystem } from "../../../romulator-models/src";

export interface IZRomulatorSystemAvatarCard {
  system: IZRomulatorSystem;

  CardProps?: Pick<IZCard, "footer">;
}

export function ZRomulatorSystemAvatarCard(props: IZRomulatorSystemAvatarCard) {
  const { system, CardProps } = props;
  // TODO: Add support for other regions
  const src = `/systems/us/${system.id}-256x256.png`;

  return (
    <ZCard
      className="ZRomulatorSystemCard-root"
      TitleProps={{
        avatar: <ZIconFontAwesome name="gamepad" width={ZSizeFixed.Small} />,
        heading: system.short,
        subHeading: system.name,
      }}
      name={system.id}
      {...CardProps}
    >
      <ZStack
        orientation={ZOrientation.Horizontal}
        justify={{ content: "center" }}
      >
        <ZImageSource src={src} width={ZSizeFixed.ExtraLarge} />
      </ZStack>
    </ZCard>
  );
}
