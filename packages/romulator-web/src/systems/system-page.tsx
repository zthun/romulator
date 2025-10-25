import {
  useFashionTheme,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZCaption,
  ZCard,
  ZGrid,
  ZIconFontAwesome,
  ZLabel,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { firstDefined } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
} from "@zthun/helpful-query";
import {
  isStateErrored,
  isStateLoading,
  useSyncState,
} from "@zthun/helpful-react";
import {
  ZRomulatorSystemContentType,
  ZRomulatorSystemHardwareType,
  ZRomulatorSystemMediaFormat,
} from "@zthun/romulator-client";
import { kebabCase, startCase } from "lodash-es";
import { useMemo } from "react";
import { ZRomulatorGamesList } from "../games/games-list.js";
import { useSystem } from "./systems-service.mjs";

// TODO:  These enum headers should be done in i18n.  Keeping them here for now is fine.
const HardwareTypeDisplay: Record<ZRomulatorSystemHardwareType, string> = {
  [ZRomulatorSystemHardwareType.Accessory]: "Accessory",
  [ZRomulatorSystemHardwareType.Arcade]: "Arcade",
  [ZRomulatorSystemHardwareType.Computer]: "Computer",
  [ZRomulatorSystemHardwareType.Console]: "Console",
  [ZRomulatorSystemHardwareType.Flipper]: "Pinball Machine",
  [ZRomulatorSystemHardwareType.Handheld]: "Handheld",
  [ZRomulatorSystemHardwareType.ScummVm]: "ScummVm",
  [ZRomulatorSystemHardwareType.Smartphone]: "Phone",
  [ZRomulatorSystemHardwareType.Unknown]: "?",
  [ZRomulatorSystemHardwareType.VirtualMachine]: "Virtual Machine",
};

const MediaFormatDisplay: Record<ZRomulatorSystemMediaFormat, string> = {
  [ZRomulatorSystemMediaFormat.Cartridge]: "Cartridge",
  [ZRomulatorSystemMediaFormat.Cd]: "CD",
  [ZRomulatorSystemMediaFormat.FloppyDisk]: "Floppy Disk",
  [ZRomulatorSystemMediaFormat.Pcb]: "PCB",
  [ZRomulatorSystemMediaFormat.Unknown]: "?",
};

const ContentTypeDisplay: Record<ZRomulatorSystemContentType, string> = {
  [ZRomulatorSystemContentType.Disk]: "Disk",
  [ZRomulatorSystemContentType.File]: "File",
  [ZRomulatorSystemContentType.Folder]: "Folder",
  [ZRomulatorSystemContentType.ReadOnlyMemory]: "ROM",
  [ZRomulatorSystemContentType.Unknown]: "?",
};

export function ZRomulatorSystemPage() {
  const { id } = useParams();
  const { error } = useFashionTheme();
  const [system] = useSystem(firstDefined("", id));
  const gameFilter = useMemo(
    () =>
      new ZFilterBinaryBuilder().subject("system").equal().value(id).build(),
    [id],
  );

  const baseGameRequest = useMemo(
    () => new ZDataRequestBuilder().size(12).filter(gameFilter).build(),
    [gameFilter],
  );

  const [userRequest, setGameRequest] = useSyncState(baseGameRequest);

  const renderSystemInfoField = (
    label: string,
    value?: string,
    display?: string,
  ) => (
    <>
      <ZLabel>{label}:</ZLabel>
      <ZCaption
        compact
        className={`ZRomulatorSystemPage-${kebabCase(label)}`}
        data-value={value}
      >
        {firstDefined(value, display)}
      </ZCaption>
    </>
  );

  const renderPageContent = () => {
    if (isStateLoading(system)) {
      return (
        <ZSuspenseProgress name="system-loading" height={ZSizeFixed.Large} />
      );
    }

    if (isStateErrored(system)) {
      return (
        <ZAlert
          fashion={error}
          heading="Cannot load System"
          message={system.message}
        />
      );
    }

    const { name, company, classification, productionYears } = system;
    const { hardwareType, mediaFormat, contentType } = classification;
    const { start, end } = productionYears;

    const _hardware = HardwareTypeDisplay[hardwareType];
    const _media = MediaFormatDisplay[mediaFormat];
    const _content = ContentTypeDisplay[contentType];

    return (
      <ZStack gap={ZSizeFixed.Medium}>
        <ZGrid columns="auto 1fr">
          <ZCard
            name="system-info"
            TitleProps={{
              avatar: (
                <ZIconFontAwesome
                  name="puzzle-piece"
                  width={ZSizeFixed.Medium}
                />
              ),
              heading: "Information",
              subHeading: "Details about this system",
            }}
          >
            <ZGrid
              columns="auto auto"
              gap={ZSizeFixed.Medium}
              width={ZSizeVaried.Fit}
              align={{ items: "center" }}
            >
              {renderSystemInfoField("Name", name)}
              {renderSystemInfoField("Company", company)}
              {renderSystemInfoField("Hardware Type", hardwareType, _hardware)}
              {renderSystemInfoField("Media Format", mediaFormat, _media)}
              {renderSystemInfoField("Content Type", contentType, _content)}
              {renderSystemInfoField("Production Start", String(start))}
              {renderSystemInfoField(
                "Production End",
                String(end),
                startCase(String(end)),
              )}
            </ZGrid>
          </ZCard>
        </ZGrid>
        <ZCard
          name="game-list"
          TitleProps={{
            avatar: (
              <ZIconFontAwesome name="gamepad" width={ZSizeFixed.Medium} />
            ),
            heading: "Games",
            subHeading: `Your ${system.name} Games`,
          }}
        >
          <ZRomulatorGamesList
            value={userRequest}
            onValueChange={setGameRequest}
          />
        </ZCard>
      </ZStack>
    );
  };

  return (
    <ZStack gap={ZSizeFixed.Medium} className="ZRomulatorSystemPage-root">
      <ZBreadcrumbsLocation />

      {renderPageContent()}
    </ZStack>
  );
}
