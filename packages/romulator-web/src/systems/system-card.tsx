import { ZCard, ZImageSource } from "@zthun/fashion-boutique";
import { IZRomulatorSystem } from "@zthun/romulator";

export interface IZRomulatorSystemCard {
  system: IZRomulatorSystem;
}

export function ZRomulatorSystemCard(props: IZRomulatorSystemCard) {
  const { system } = props;

  return (
    <ZCard
      className="ZRomulatorSystemCard-root"
      TitleProps={{
        heading: system.short,
        subHeading: system.name,
      }}
      name={system.id}
    >
      {/* TODO: Add support for retrieving system media */}
      <ZImageSource />
    </ZCard>
  );
}
