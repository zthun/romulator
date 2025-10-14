import {
  useFashionTheme,
  useNavigate,
  ZBox,
  ZGridView,
  ZImageSource,
  ZStack,
  type IZComponentValue,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
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

  const renderTile = (value: IZRomulatorGame) => {
    const { api } = new ZRomulatorEnvironmentBuilder().build();
    const id = `${value.id}-marquees`;
    const wheel = `${api}/media/${id}`;

    return (
      <ZBox
        className="ZRomulatorGameTile-root"
        fashion={body}
        interactive
        key={value.id}
        cursor="pointer"
        padding={ZSizeFixed.Small}
        data-name={value.id}
        onClick={() => navigate(`/games/${value.id}`)}
      >
        <ZStack
          justify={{ content: "center" }}
          align={{ items: "center" }}
          height={ZSizeVaried.Full}
        >
          <ZImageSource src={wheel} width={ZSizeVaried.Full} />
        </ZStack>
      </ZBox>
    );
  };

  return (
    <ZGridView
      GridProps={{
        columns: {
          xl: "1fr 1fr 1fr 1fr",
          lg: "1fr 1fr 1fr",
          md: "1fr 1fr",
          sm: "1fr",
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
