import type { IZCard } from "@zthun/fashion-boutique";
import {
  useCss,
  ZCard,
  ZFlex,
  ZGridView,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { css, cssJoinDefined, ZOrientation } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
} from "@zthun/helpful-query";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import { useMemo, useState } from "react";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";
import { useGamesService } from "../games/games-service.mjs";

export interface IZRomulatorSystemCard {
  system: IZRomulatorSystem;

  CardProps?: Pick<IZCard, "footer">;
}

export function ZRomulatorSystemCard(props: IZRomulatorSystemCard) {
  const { system, CardProps } = props;
  const { api } = new ZRomulatorEnvironmentBuilder().build();
  const wheelId = `${system.id}-wheel`;
  const wheel = `${api}/media/${wheelId}`;
  const games = useGamesService();
  const filter = useMemo(
    () =>
      new ZFilterBinaryBuilder()
        .subject("system")
        .equal()
        .value(system.id)
        .build(),
    [wheelId],
  );
  const [request, setRequest] = useState(
    new ZDataRequestBuilder().filter(filter).build(),
  );

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
      TitleProps={{
        avatar: <ZImageSource src={wheel} width={ZSizeFixed.ExtraLarge} />,
      }}
    >
      <ZStack
        className="ZRomulatorSystemCard-avatar"
        orientation={ZOrientation.Horizontal}
        gap={ZSizeFixed.Large}
      >
        <ZFlex grow={1}>
          <ZGridView
            dataSource={games}
            renderItem={(game) => game.name}
            value={request}
            onValueChange={setRequest}
          />
        </ZFlex>
      </ZStack>
    </ZCard>
  );
}
