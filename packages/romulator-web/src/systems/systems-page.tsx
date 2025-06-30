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
import { ZDataRequestBuilder, ZSortBuilder } from "@zthun/helpful-query";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import { useState } from "react";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";
import { useSystemsService } from "./systems-service.mjs";

const DefaultSystemSortOrder = new ZSortBuilder()
  .ascending("generation")
  .ascending("name")
  .build();

const DefaultSystemRequest = new ZDataRequestBuilder()
  .sort(DefaultSystemSortOrder)
  .build();

export function ZRomulatorSystemsPage() {
  const { body } = useFashionTheme();
  const navigate = useNavigate();
  const source = useSystemsService();
  const [request, setRequest] = useState(DefaultSystemRequest);

  const tile = useCss(css`
    & {
      height: 100%;
    }
  `);

  const renderTile = (system: IZRomulatorSystem) => {
    const { api } = new ZRomulatorEnvironmentBuilder().build();
    const id = `${system.id}-wheel`;
    const wheel = `${api}/media/${id}`;

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
          value={request}
          onValueChange={setRequest}
          dataSource={source}
          renderItem={renderTile}
        />
      </ZCard>
    </ZStack>
  );
}
