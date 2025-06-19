import {
  useFashionTheme,
  useNavigate,
  ZBox,
  ZBreadcrumbsLocation,
  ZCaption,
  ZCard,
  ZContentTitle,
  ZGridView,
  ZH3,
  ZIconFontAwesome,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import type { IZRomulatorConfig } from "@zthun/romulator-client";
import { useState } from "react";
import { useSettingsService } from "./settings-service.mjs";

export function ZRomulatorSettingsPage() {
  const { body } = useFashionTheme();
  const navigate = useNavigate();
  const settings = useSettingsService();
  const [request] = useState(new ZDataRequestBuilder().build());

  const renderTile = (config: IZRomulatorConfig) => {
    return (
      <ZBox
        className="ZRomulatorSettingsPage-tile"
        fashion={body}
        interactive
        key={config.id}
        cursor="pointer"
        padding={ZSizeFixed.Medium}
        data-name={config.id}
        onClick={() => navigate(config.id)}
      >
        <ZStack gap={ZSizeFixed.Medium}>
          <ZContentTitle
            avatar={
              <ZIconFontAwesome
                name={config.avatar}
                width={ZSizeFixed.Medium}
              />
            }
            heading={<ZH3 compact>{config.name}</ZH3>}
            subHeading={<ZCaption>{config.description}</ZCaption>}
          />
        </ZStack>
      </ZBox>
    );
  };

  return (
    <ZStack gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      <ZCard
        TitleProps={{
          heading: <ZH3 compact>Settings</ZH3>,
          subHeading: <ZCaption compact>Modify configs and options</ZCaption>,
          avatar: <ZIconFontAwesome name="gear" width={ZSizeFixed.Medium} />,
        }}
      >
        <ZGridView
          className="ZRomulatorSettingsPage-root"
          GridProps={{
            columns: {
              xl: "1fr 1fr 1fr",
              lg: "1fr 1fr",
              sm: "1fr",
            },
            gap: ZSizeFixed.Medium,
          }}
          SearchProps={false}
          dataSource={settings}
          value={request}
          renderItem={renderTile}
        />
      </ZCard>
    </ZStack>
  );
}
