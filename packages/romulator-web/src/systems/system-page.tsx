import {
  useFashionTheme,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZCard,
  ZIconFontAwesome,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { firstDefined } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
} from "@zthun/helpful-query";
import {
  isStateErrored,
  isStateLoading,
  useSyncState,
} from "@zthun/helpful-react";
import { useMemo } from "react";
import { ZRomulatorGamesList } from "../games/games-list.js";
import { useSystem } from "./systems-service.mjs";

export function ZRomulatorSystemPage() {
  const { id } = useParams();
  const { error } = useFashionTheme();
  const [system] = useSystem(firstDefined("", id));
  const gameFilter = useMemo(
    () =>
      new ZFilterBinaryBuilder().subject("system").equal().value(id).build(),
    [id],
  );

  const baseGameRequest = useMemo(
    () => new ZDataRequestBuilder().filter(gameFilter).build(),
    [gameFilter],
  );

  const [userRequest, setGameRequest] = useSyncState(baseGameRequest);

  const renderSystemInformation = () => {
    if (isStateLoading(system)) {
      return (
        <ZSuspenseProgress name="system-loading" height={ZSizeFixed.Large} />
      );
    }

    if (isStateErrored(system)) {
      return (
        <ZAlert
          fashion={error}
          heading="Cannot load System"
          message={system.message}
        />
      );
    }

    return (
      <ZStack gap={ZSizeFixed.Medium}>
        <ZCard
          name="system-info"
          TitleProps={{
            avatar: (
              <ZIconFontAwesome name="puzzle-piece" width={ZSizeFixed.Medium} />
            ),
            heading: system.name,
            subHeading: system.company,
          }}
        />
        <ZCard
          name="game-list"
          TitleProps={{
            avatar: (
              <ZIconFontAwesome name="gamepad" width={ZSizeFixed.Medium} />
            ),
            heading: "Games",
            subHeading: `Your ${system.name} Games`,
          }}
        >
          <ZRomulatorGamesList
            value={userRequest}
            onValueChange={setGameRequest}
          />
        </ZCard>
      </ZStack>
    );
  };

  return (
    <ZStack gap={ZSizeFixed.Medium} className={"ZRomulatorSystemPage-root"}>
      <ZBreadcrumbsLocation />

      {renderSystemInformation()}
    </ZStack>
  );
}
