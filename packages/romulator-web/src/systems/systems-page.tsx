import {
  useCss,
  useFashionTheme,
  useNavigate,
  ZBox,
  ZBreadcrumbsLocation,
  ZCard,
  ZContentTitle,
  ZGridView,
  ZH5,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css, cssJoinDefined } from "@zthun/helpful-fn";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import { useSystemsService } from "./systems-service.mjs";

export function ZRomulatorSystemsPage() {
  const { body } = useFashionTheme();
  const navigate = useNavigate();
  const source = useSystemsService();

  const tile = useCss(css`
    & {
      height: 100%;
    }
  `);

  const renderTile = (system: IZRomulatorSystem) => {
    const wheel = `/systems/wheel/${system.id}.png`;
    return (
      <ZBox
        className="ZRomulatorSystemsPage-tile"
        fashion={body}
        interactive
        key={system.id}
        cursor="pointer"
        padding={ZSizeFixed.Small}
        data-name={system.id}
        onClick={() => navigate(system.id)}
      >
        <ZStack
          className={cssJoinDefined(tile)}
          gap={ZSizeFixed.Medium}
          justify={{ content: "center" }}
          align={{ items: "stretch" }}
        >
          <ZContentTitle
            avatar={<ZImageSource src={wheel} height={ZSizeFixed.Medium} />}
            heading={<ZH5 compact>{system.name}</ZH5>}
          />
        </ZStack>
      </ZBox>
    );
  };

  return (
    <ZStack gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      <ZCard
        width={ZSizeVaried.Full}
        TitleProps={{
          heading: "Systems",
          subHeading: "Your games organized by system",
        }}
      >
        <ZGridView
          className="ZRomulatorSystemsPage-root"
          GridProps={{
            columns: {
              xl: "1fr 1fr 1fr 1fr",
              lg: "1fr 1fr",
              sm: "1fr",
            },
            gap: ZSizeFixed.Medium,
          }}
          dataSource={source}
          renderItem={renderTile}
        />
      </ZCard>
    </ZStack>
  );
}
