import {
  useCss,
  useFashionTheme,
  useNavigate,
  ZBreadcrumbsLocation,
  ZCard,
  ZGridView,
  ZIconFontAwesome,
  ZImageSource,
  ZStack,
  ZTile,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css } from "@zthun/helpful-fn";
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
  .size(12)
  .sort(DefaultSystemSortOrder)
  .build();

export function ZRomulatorSystemsPage() {
  const { body } = useFashionTheme();
  const navigate = useNavigate();
  const systems = useSystemsService();
  const [request, setRequest] = useState(DefaultSystemRequest);

  const _className = useCss(css`
    .ZRomulatorSystemsPage-wheel > img {
      max-width: 24rem;
      max-height: 12rem;
    }
  `);

  const renderTile = (system: IZRomulatorSystem) => {
    const { api } = new ZRomulatorEnvironmentBuilder().build();
    const id = `${system.id}-wheel`;
    const wheel = `${api}/media/${id}`;

    return (
      <ZTile
        className="ZRomulatorSystemsPage-tile"
        fashion={body}
        key={system.id}
        name={system.id}
        onActivate={navigate.bind(null, system.id)}
      >
        <ZStack
          justify={{ content: "center" }}
          align={{ items: "center" }}
          height={ZSizeVaried.Full}
          width={ZSizeVaried.Full}
        >
          <ZImageSource
            className="ZRomulatorSystemsPage-wheel"
            src={wheel}
            width={ZSizeVaried.Full}
          />
        </ZStack>
      </ZTile>
    );
  };

  return (
    <ZStack className={_className} gap={ZSizeFixed.Medium}>
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
              xl: "1fr 1fr 1fr 1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
              md: "1fr 1fr 1fr",
              sm: "1fr 1fr",
              xs: "1fr",
            },
            gap: ZSizeFixed.Medium,
          }}
          dataSource={systems}
          renderItem={renderTile}
          value={request}
          onValueChange={setRequest}
        />
      </ZCard>
    </ZStack>
  );
}
