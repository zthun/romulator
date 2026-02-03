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
  ZTile,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import type { IZJob } from "@zthun/romulator-client";
import { useState } from "react";
import { useJobsService } from "./jobs-service.js";

export function ZRomulatorJobsPage() {
  const { body, primary } = useFashionTheme();
  const jobs = useJobsService();
  const [request, setRequest] = useState(new ZDataRequestBuilder().build());

  const renderTile = (job: IZJob) => {
    return (
      <ZTile
        className="ZRomulatorJobsPage-tile"
        fashion={body}
        key={job.id}
        name={job.id}
      >
        <ZStack
          justify={{ content: "center" }}
          align={{ items: "center" }}
          height={ZSizeVaried.Full}
          width={ZSizeVaried.Full}
        >
          {job.type}
        </ZStack>
      </ZTile>
    );
  };

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
              xl: "1fr 1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
              md: "1fr 1fr 1fr",
              sm: "1fr 1fr",
              xs: "1fr",
            },
            gap: ZSizeFixed.Medium,
          }}
          dataSource={jobs}
          renderItem={renderTile}
          value={request}
        />
      </ZCard>
    </ZStack>
  );
}
