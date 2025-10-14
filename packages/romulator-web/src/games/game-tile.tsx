import {
  useFashionTheme,
  useNavigate,
  ZBox,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";

export interface IZRomulatorGameTile {
  value: IZRomulatorGame;
}

export function ZRomulatorGameTile(props: IZRomulatorGameTile) {
  const { body } = useFashionTheme();
  const navigate = useNavigate();
  const { value } = props;
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
}
