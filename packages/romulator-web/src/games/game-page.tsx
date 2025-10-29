import {
  useFashionTheme,
  useNavigate,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZButton,
  ZCaption,
  ZCard,
  ZGrid,
  ZIconFontAwesome,
  ZLabel,
  ZParagraph,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { firstDefined } from "@zthun/helpful-fn";
import { isStateErrored, isStateLoading } from "@zthun/helpful-react";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import {
  ZRomulatorGameMediaType,
  ZRomulatorPlayersSerialize,
  ZRomulatorSystemMediaType,
} from "@zthun/romulator-client";
import { kebabCase } from "lodash-es";
import { useMemo } from "react";
import { ZRomulatorMediaCard } from "../media/media-card.js";
import { useMediaService } from "../media/media-service.js";
import { useGame } from "./games-service.mjs";

export function ZRomulatorGamePage() {
  const { id } = useParams();
  const { error, primary } = useFashionTheme();
  const media = useMediaService();
  const [game] = useGame(firstDefined("", id));
  const navigate = useNavigate();

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
        xl: "1fr 1fr 1fr",
        lg: "1fr 1fr",
        md: "1fr",
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
        <pre style={{ textWrap: "wrap" }}>
          <ZParagraph compact>{game.description}</ZParagraph>
        </pre>
      </ZCard>
    );
  };

  const renderSystemCard = (game: IZRomulatorGame) => {
    const src = media.url(game.system, ZRomulatorSystemMediaType.Wheel);
    const route = `/systems/${game.system}`;

    return (
      <ZCard
        name="system"
        TitleProps={{
          avatar: (
            <ZIconFontAwesome name="puzzle-piece" width={ZSizeFixed.Medium} />
          ),
          heading: "System",
          subHeading: "What system this game is on",
        }}
        footer={
          <ZButton
            fashion={primary}
            avatar={
              <ZIconFontAwesome name="arrow-left" width={ZSizeFixed.Small} />
            }
            width={ZSizeVaried.Full}
            label="Check it out"
            name="navigate-to-system"
            onClick={() => navigate(route)}
          />
        }
      >
        <ZStack justify={{ content: "center" }}>
          <img src={src} style={{ objectFit: "scale-down" }} />
        </ZStack>
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
        columns={{ xl: "28rem auto", md: "1fr" }}
        gap={ZSizeFixed.Medium}
        align={{ items: "start" }}
      >
        <ZStack gap={ZSizeFixed.Medium}>
          {renderInfoCard(game)}
          {renderSynopsisCard(game)}
          {renderSystemCard(game)}
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
