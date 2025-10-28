import {
  useFashionTheme,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZGrid,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { firstDefined } from "@zthun/helpful-fn";
import { isStateErrored, isStateLoading } from "@zthun/helpful-react";
import { ZRomulatorGameMediaType } from "@zthun/romulator-client";
import { useMemo } from "react";
import { ZRomulatorMediaCard } from "../media/media-card.js";
import { useGame } from "./games-service.mjs";

export function ZRomulatorGamePage() {
  const { id } = useParams();
  const { error } = useFashionTheme();
  const [game] = useGame(firstDefined("", id));

  const excluded = useMemo(
    () => [ZRomulatorGameMediaType.Video, ZRomulatorGameMediaType.Manual],
    [],
  );
  const images = useMemo(
    () =>
      Object.values(ZRomulatorGameMediaType).filter(
        (x) => !excluded.includes(x),
      ),
    [excluded],
  );

  const renderContent = () => {
    if (isStateLoading(game)) {
      return (
        <ZSuspenseProgress name="game-loading" height={ZSizeFixed.Large} />
      );
    }

    if (isStateErrored(game)) {
      return (
        <ZAlert
          fashion={error}
          heading="Cannot load Game"
          message={game.message}
        />
      );
    }

    return (
      <ZGrid
        columns={{
          xl: "1fr 1fr 1fr 1fr",
          lg: "1fr 1fr 1fr",
          md: "1fr 1fr",
          sm: "1fr",
        }}
        gap={ZSizeFixed.Medium}
      >
        {images.map((type) => (
          <ZRomulatorMediaCard key={type} identifier={game.id} type={type} />
        ))}
      </ZGrid>
    );
  };

  return (
    <ZStack className="ZRomulatorGamePage-root" gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      {renderContent()}
    </ZStack>
  );
}
