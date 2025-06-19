import {
  useParams,
  ZBreadcrumbsLocation,
  ZCard,
  ZIconFontAwesome,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { asStateData, isStateLoading } from "@zthun/helpful-react";
import type { ZRomulatorConfigId } from "@zthun/romulator-client";
import { useSetting } from "./settings-service.mjs";

export function ZRomulatorSettingPage() {
  const { id } = useParams();
  const [setting] = useSetting(id as ZRomulatorConfigId);
  const _setting = asStateData(setting);

  return (
    <ZStack className="ZRomulatorSettingPage-root" gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      <ZCard
        TitleProps={{
          avatar: (
            <ZIconFontAwesome
              name={_setting?.avatar}
              width={ZSizeFixed.Medium}
            />
          ),
          heading: _setting?.name,
          subHeading: _setting?.description,
        }}
      >
        <ZSuspenseProgress disabled={!isStateLoading(setting)} />
      </ZCard>
    </ZStack>
  );
}
