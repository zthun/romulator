import {
  useFashionTheme,
  ZBreadcrumbsLocation,
  ZButton,
  ZCard,
  ZGrid,
  ZGridView,
  ZIconFontAwesome,
  ZSearch,
  ZStack,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import { useState } from "react";
import { ZJobTile } from "./job-tile.js";
import { useJobsService } from "./jobs-service.js";

export function ZRomulatorJobsPage() {
  const { primary } = useFashionTheme();
  const jobs = useJobsService();
  const [request, setRequest] = useState(new ZDataRequestBuilder().build());

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
          avatar: (
            <ZIconFontAwesome name="briefcase" width={ZSizeFixed.Medium} />
          ),
          heading: "Jobs",
          subHeading: "What's running in the background",
        }}
      >
        <ZGridView
          className="ZRomulatorJobsPage-root"
          heading={
            <ZGrid
              align={{ items: "flex-end" }}
              columns={{ xl: "1fr auto", sm: "1fr" }}
              gap={ZSizeFixed.Medium}
            >
              <ZSearch value={request} onValueChange={setRequest} />
              <ZButton
                avatar={
                  <ZIconFontAwesome name="cog" width={ZSizeFixed.ExtraSmall} />
                }
                label="Create"
                fashion={primary}
              />
            </ZGrid>
          }
          GridProps={{
            columns: {
              xl: "1fr 1fr 1fr",
              lg: "1fr 1fr",
              md: "1fr",
            },
            gap: ZSizeFixed.Medium,
          }}
          dataSource={jobs}
          renderItem={(job) => <ZJobTile key={job.id} value={job} />}
          value={request}
        />
      </ZCard>
    </ZStack>
  );
}
