import {
  ZBreadcrumbsLocation,
  ZCard,
  ZIconFontAwesome,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { ZDataRequestBuilder, ZSortBuilder } from "@zthun/helpful-query";
import { useState } from "react";

import { ZRomulatorGamesList } from "./games-list.js";

const DefaultGameSortOrder = new ZSortBuilder().ascending("name").build();

const DefaultGameRequest = new ZDataRequestBuilder()
  .size(24)
  .sort(DefaultGameSortOrder)
  .build();

export function ZRomulatorGamesPage() {
  const [request, setRequest] = useState(DefaultGameRequest);

  return (
    <ZStack
      className="ZRomulatorGamesPage-root"
      gap={ZSizeFixed.Medium}
      width={ZSizeVaried.Full}
    >
      <ZBreadcrumbsLocation />
      <ZCard
        width={ZSizeVaried.Full}
        TitleProps={{
          avatar: <ZIconFontAwesome name="gamepad" width={ZSizeFixed.Medium} />,
          heading: "Games",
          subHeading: "Browse your library",
        }}
      >
        <ZRomulatorGamesList value={request} onValueChange={setRequest} />
      </ZCard>
    </ZStack>
  );
}
