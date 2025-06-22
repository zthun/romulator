import type { IZCard } from "@zthun/fashion-boutique";
import { useCss, ZCard, ZImageSource, ZStack } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { css, cssJoinDefined, ZOrientation } from "@zthun/helpful-fn";

export interface IZRomulatorSystemAvatarCard {
  system: any;

  CardProps?: Pick<IZCard, "footer">;
}

export function ZRomulatorSystemAvatarCard(props: IZRomulatorSystemAvatarCard) {
  const { system, CardProps } = props;
  const src = `/systems/wheel/${system.id}.png`;

  const _className = useCss(css`
    &.ZRomulatorSystemCard-root .ZRomulatorSystemCard-avatar {
      height: 100%;
      width: 100%;
    }
  `);

  return (
    <ZCard
      className={cssJoinDefined("ZRomulatorSystemCard-root", _className)}
      name={system.id}
      {...CardProps}
    >
      <ZStack
        className="ZRomulatorSystemCard-avatar"
        orientation={ZOrientation.Horizontal}
        justify={{ content: "center", items: "center" }}
        align={{ content: "center", items: "center" }}
      >
        <ZImageSource src={src} width={ZSizeFixed.ExtraLarge} />
      </ZStack>
    </ZCard>
  );
}
