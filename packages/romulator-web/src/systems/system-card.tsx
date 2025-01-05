import {
  ZCard,
  ZIconFontAwesome,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { ZOrientation } from "@zthun/helpful-fn";
import { IZRomulatorSystem } from "@zthun/romulator";

export interface IZRomulatorSystemCard {
  system: IZRomulatorSystem;
}

export function ZRomulatorSystemCard(props: IZRomulatorSystemCard) {
  const { system } = props;
  const src = `/png/${system.id}-256x256.png`;

  return (
    <ZCard
      className="ZRomulatorSystemCard-root"
      TitleProps={{
        avatar: <ZIconFontAwesome name="gamepad" width={ZSizeFixed.Small} />,
        heading: system.short,
        subHeading: system.name,
      }}
      name={system.id}
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
