import {
  useCss,
  useFashionTheme,
  useNavigate,
  ZBreadcrumbsLocation,
  ZCard,
  ZGridView,
  ZIconFontAwesome,
  ZImage,
  ZPagination,
  ZSearch,
  ZStack,
  ZTile,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { css } from "@zthun/helpful-fn";
import { ZDataRequestBuilder, ZSortBuilder } from "@zthun/helpful-query";
import {
  ZRomulatorSystemMediaType,
  type IZRomulatorSystem,
} from "@zthun/romulator-client";
import { useState } from "react";
import { useMediaService } from "../media/media-service.js";
import { useSystemsService } from "./systems-service.mjs";

const DefaultSystemSortOrder = new ZSortBuilder()
  .ascending("generation")
  .ascending("name")
  .build();

const DefaultSystemRequest = new ZDataRequestBuilder()
  .size(48)
  .sort(DefaultSystemSortOrder)
  .build();

export function ZRomulatorSystemsPage() {
  const { body } = useFashionTheme();
  const navigate = useNavigate();
  const systems = useSystemsService();
  const media = useMediaService();
  const [request, setRequest] = useState(DefaultSystemRequest);

  const _className = useCss(css`
    .ZRomulatorSystemsPage-tile {
      height: 10rem;
    }
  `);

  const renderTile = (system: IZRomulatorSystem) => {
    const src = media.url(system, ZRomulatorSystemMediaType.Wheel);
    const onActivate = () => navigate(system.id);

    return (
      <ZTile
        className="ZRomulatorSystemsPage-tile"
        fashion={body}
        key={system.id}
        name={system.id}
        onActivate={onActivate}
      >
        <ZStack
          justify={{ content: "center" }}
          align={{ items: "center" }}
          height={ZSizeVaried.Full}
          width={ZSizeVaried.Full}
        >
          <ZImage
            className="ZRomulatorSystemsPage-wheel"
            src={src}
            width={ZSizeVaried.Full}
            height={ZSizeVaried.Full}
            fit="scale-down"
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
              xl: "1fr 1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
              md: "1fr 1fr 1fr",
              sm: "1fr 1fr",
              xs: "1fr",
            },
            gap: ZSizeFixed.Medium,
          }}
          heading={<ZSearch value={request} onValueChange={setRequest} />}
          footer={
            <ZPagination
              dataSource={systems}
              value={request}
              onValueChange={setRequest}
            />
          }
          dataSource={systems}
          renderItem={renderTile}
          value={request}
        />
      </ZCard>
    </ZStack>
  );
}
