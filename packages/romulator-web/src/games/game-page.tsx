import {
  useFashionTheme,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZCaption,
  ZCard,
  ZGrid,
  ZIconFontAwesome,
  ZLabel,
  ZParagraph,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { firstDefined } from "@zthun/helpful-fn";
import { isStateErrored, isStateLoading } from "@zthun/helpful-react";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import {
  ZRomulatorGameMediaType,
  ZRomulatorPlayersSerialize,
} from "@zthun/romulator-client";
import { kebabCase } from "lodash-es";
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

  const renderMedia = (
    game: IZRomulatorGame,
    type: ZRomulatorGameMediaType,
  ) => <ZRomulatorMediaCard key={type} identifier={game.id} type={type} />;

  const renderMediaGallery = (game: IZRomulatorGame) => (
    <ZGrid
      columns={{
        xl: "1fr 1fr 1fr 1fr",
        lg: "1fr 1fr 1fr",
        md: "1fr 1fr",
        sm: "1fr",
      }}
      gap={ZSizeFixed.Medium}
    >
      {images.map((i) => renderMedia(game, i))}
    </ZGrid>
  );

  const renderInfoCard = (game: IZRomulatorGame) => {
    const renderGameInfoField = (
      label: string,
      value?: string,
      display?: string,
    ) => (
      <>
        <ZLabel>{label}:</ZLabel>
        <ZCaption
          compact
          className={`ZRomulatorGamePage-${kebabCase(label)}`}
          data-value={value}
        >
          {firstDefined(value, display)}
        </ZCaption>
      </>
    );

    const _players = new ZRomulatorPlayersSerialize().serialize(game.players);

    return (
      <ZCard
        name="info"
        TitleProps={{
          avatar: <ZIconFontAwesome name="gamepad" width={ZSizeFixed.Medium} />,
          heading: "Information",
          subHeading: "Game Details",
        }}
      >
        <ZGrid columns="auto 1fr" gap={ZSizeFixed.Medium}>
          {renderGameInfoField("Name", game.name)}
          {renderGameInfoField("File", game.file)}
          {renderGameInfoField("Players", _players)}
          {renderGameInfoField("Release Date", game.release)}
          {renderGameInfoField("Developer", game.developer)}
          {renderGameInfoField("Publisher", game.publisher)}
        </ZGrid>
      </ZCard>
    );
  };

  const renderSynopsisCard = (game: IZRomulatorGame) => {
    return (
      <ZCard
        name="synopsis"
        TitleProps={{
          avatar: <ZIconFontAwesome name="book" width={ZSizeFixed.Medium} />,
          heading: "Synopsis",
          subHeading: "Game description",
        }}
      >
        <pre>
          <ZParagraph compact>{game.description}</ZParagraph>
        </pre>
      </ZCard>
    );
  };

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
        columns="auto 1fr"
        gap={ZSizeFixed.Medium}
        align={{ items: "start" }}
      >
        <ZStack gap={ZSizeFixed.Medium}>
          {renderInfoCard(game)}
          {renderSynopsisCard(game)}
        </ZStack>
        {renderMediaGallery(game)}
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
