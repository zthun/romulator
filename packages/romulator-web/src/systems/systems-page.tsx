import {
  useCss,
  useFashionTheme,
  useNavigate,
  ZBox,
  ZBreadcrumbsLocation,
  ZCard,
  ZContentTitle,
  ZGridView,
  ZIconFontAwesome,
  ZImageSource,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css, cssJoinDefined, ZOrientation } from "@zthun/helpful-fn";
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
          orientation={ZOrientation.Horizontal}
          justify={{ content: "center" }}
          align={{ items: "center" }}
        >
          <ZContentTitle
            avatar={
              <ZImageSource
                src={wheel}
                height={ZSizeVaried.Full}
                width={ZSizeVaried.Full}
              />
            }
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
          avatar: (
            <ZIconFontAwesome name="puzzle-piece" width={ZSizeFixed.Medium} />
          ),
          heading: "Systems",
          subHeading: "Your games organized by system",
        }}
      >
        <ZGridView
          className="ZRomulatorSystemsPage-root"
          GridProps={{
            columns: {
              xl: "1fr 1fr 1fr 1fr",
              lg: "1fr 1fr 1fr",
              md: "1fr 1fr",
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
