import {
  useCss,
  useFashionTheme,
  useNavigate,
  ZGridView,
  ZImage,
  ZPagination,
  ZSearch,
  ZStack,
  ZTile,
  type IZComponentValue,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css, cssJoinDefined } from "@zthun/helpful-fn";
import { ZDataRequestBuilder, type IZDataRequest } from "@zthun/helpful-query";
import { useAmbassadorState } from "@zthun/helpful-react";
import {
  ZRomulatorGameMediaType,
  type IZRomulatorGame,
} from "@zthun/romulator-client";
import { useMediaService } from "../media/media-service.js";
import { useGamesService } from "./games-service.mjs";

export interface IZRomulatorGamesList extends IZComponentValue<IZDataRequest> {}

export function ZRomulatorGamesList(props: IZRomulatorGamesList) {
  const { value, onValueChange } = props;
  const [request, setRequest] = useAmbassadorState(
    value,
    onValueChange,
    new ZDataRequestBuilder().size(24).build(),
  );
  const games = useGamesService();
  const media = useMediaService();
  const { body } = useFashionTheme();
  const navigate = useNavigate();

  const _className = useCss(css`
    .ZRomulatorGameTile-root {
      height: 10rem;
    }
  `);

  const renderTile = (value: IZRomulatorGame) => {
    const src = media.url(value, ZRomulatorGameMediaType.Marquee);
    const onActivate = () => navigate(`/games/${value.id}`);

    return (
      <ZTile
        className={"ZRomulatorGameTile-root"}
        fashion={body}
        key={value.id}
        name={value.id}
        onActivate={onActivate}
      >
        <ZStack
          justify={{ content: "center" }}
          align={{ items: "center" }}
          height={ZSizeVaried.Full}
        >
          <ZImage
            className="ZRomulatorGameTile-marquee"
            src={src}
            width={ZSizeVaried.Full}
            height={ZSizeVaried.Full}
            fit="scale-down"
          />
        </ZStack>
      </ZTile>
    );
  };

  return (
    <ZGridView
      className={cssJoinDefined(".ZRomulatorGameList-root", _className)}
      GridProps={{
        columns: {
          xl: "1fr 1fr 1fr 1fr",
          lg: "1fr 1fr 1fr",
          md: "1fr 1fr",
          sm: "1fr",
        },
        gap: ZSizeFixed.Medium,
      }}
      heading={<ZSearch value={request} onValueChange={setRequest} />}
      footer={
        <ZPagination
          value={request}
          onValueChange={setRequest}
          dataSource={games}
        />
      }
      dataSource={games}
      renderItem={renderTile}
      value={request}
    />
  );
}
