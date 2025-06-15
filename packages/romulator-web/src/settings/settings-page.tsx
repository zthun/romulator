import {
  useFashionTheme,
  useNavigate,
  ZBox,
  ZBreadcrumbsLocation,
  ZCaption,
  ZCard,
  ZContentTitle,
  ZGrid,
  ZH2,
  ZH3,
  ZIconFontAwesome,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { startCase } from "lodash-es";
import { useMemo } from "react";
import type { IZRomulatorSettingsTile } from "./settings-tile.js";
import { ZRomulatorSettingsTileBuilder } from "./settings-tile.js";

export function ZRomulatorSettingsPage() {
  const { body } = useFashionTheme();
  const tiles = useMemo(() => ZRomulatorSettingsTileBuilder.all(), []);
  const navigate = useNavigate();

  const renderTile = (page: IZRomulatorSettingsTile) => {
    return (
      <ZBox
        className="ZRomulatorSettingsPage-tile"
        fashion={body}
        interactive
        key={page.name}
        cursor="pointer"
        padding={ZSizeFixed.Medium}
        data-setting={page.name}
        onClick={navigate.bind(null, page.name)}
      >
        <ZStack gap={ZSizeFixed.Medium}>
          <ZContentTitle
            avatar={page.avatar}
            heading={<ZH3 compact>{startCase(page.name)}</ZH3>}
            subHeading={<ZCaption>{page.description}</ZCaption>}
          />
        </ZStack>
      </ZBox>
    );
  };

  return (
    <ZStack className="ZRomulatorSettingsPage-root" gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      <ZCard
        TitleProps={{
          avatar: <ZIconFontAwesome name="gear" />,
          heading: <ZH2 compact>Settings</ZH2>,
          subHeading: "Modify configs and options",
        }}
      >
        <ZGrid
          columns={{
            xl: "1fr 1fr 1fr",
            md: "1fr 1fr",
            sm: "1fr",
          }}
          gap={ZSizeFixed.Medium}
        >
          {tiles.map(renderTile)}
        </ZGrid>
      </ZCard>
    </ZStack>
  );
}
