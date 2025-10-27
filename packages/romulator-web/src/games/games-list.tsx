import {
  useCss,
  useFashionTheme,
  useNavigate,
  ZGridView,
  ZImageSource,
  ZStack,
  ZTile,
  type IZComponentValue,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css, cssJoinDefined } from "@zthun/helpful-fn";
import { ZDataRequestBuilder, type IZDataRequest } from "@zthun/helpful-query";
import { useAmbassadorState } from "@zthun/helpful-react";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";
import { useGamesService } from "./games-service.mjs";

export interface IZRomulatorGamesList extends IZComponentValue<IZDataRequest> {}

export function ZRomulatorGamesList(props: IZRomulatorGamesList) {
  const { value, onValueChange } = props;
  const [request, setRequest] = useAmbassadorState(
    value,
    onValueChange,
    new ZDataRequestBuilder().build(),
  );
  const games = useGamesService();
  const { body } = useFashionTheme();
  const navigate = useNavigate();

  const _className = useCss(css`
    & {
      height: 10rem;
    }

    & .ZRomulatorGameTile-marquee > img {
      width: 100%;
      max-height: 10rem;
    }
  `);

  const renderTile = (value: IZRomulatorGame) => {
    const { api } = new ZRomulatorEnvironmentBuilder().build();
    const id = `${value.id}-marquees`;
    const marquee = `${api}/media/${id}`;

    return (
      <ZTile
        className={cssJoinDefined("ZRomulatorGameTile-root", _className)}
        fashion={body}
        key={value.id}
        name={value.id}
        onActivate={navigate.bind(null, `/games/${value.id}`)}
      >
        <ZStack
          justify={{ content: "center" }}
          align={{ items: "center" }}
          height={ZSizeVaried.Full}
        >
          <ZImageSource className="ZRomulatorGameTile-marquee" src={marquee} />
        </ZStack>
      </ZTile>
    );
  };

  return (
    <ZGridView
      GridProps={{
        columns: {
          xl: "1fr 1fr 1fr 1fr 1fr 1fr",
          lg: "1fr 1fr 1fr 1fr",
          md: "1fr 1fr 1fr",
          sm: "1fr 1fr",
          xs: "1fr",
        },
        gap: ZSizeFixed.Medium,
      }}
      dataSource={games}
      renderItem={renderTile}
      value={request}
      onValueChange={setRequest}
    />
  );
}
