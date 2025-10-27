import {
  useFashionTheme,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { firstDefined } from "@zthun/helpful-fn";
import { isStateErrored, isStateLoading } from "@zthun/helpful-react";
import { useGame } from "./games-service.mjs";

export function ZRomulatorGamePage() {
  const { id } = useParams();
  const { error } = useFashionTheme();
  const [game] = useGame(firstDefined("", id));

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

    return <span className="ZRomulatorGamePage-name">{game.name}</span>;
  };

  return (
    <ZStack className="ZRomulatorGamePage-root" gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      {renderContent()}
    </ZStack>
  );
}
