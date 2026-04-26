import {
  useParams,
  ZBreadcrumbsLocation,
  ZCard,
  ZForm,
  ZFormButton,
  ZFormField,
  ZIconFontAwesome,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { firstDefined, ZOrientation } from "@zthun/helpful-fn";
import type { IZMetadata } from "@zthun/helpful-query";
import { asStateData, isStateLoading } from "@zthun/helpful-react";
import type { ZRomulatorConfigId } from "@zthun/romulator-client";
import { useCallback } from "react";

import { useSetting, useSettingsService } from "./settings-service.mjs";

export function ZRomulatorSettingPage() {
  const { id } = useParams();
  const [setting, setSetting] = useSetting(id as ZRomulatorConfigId);
  const _setting = asStateData(setting);
  const metadata = firstDefined([], _setting?.metadata);
  const service = useSettingsService();

  const renderField = useCallback((meta: IZMetadata) => {
    return <ZFormField key={meta.id} metadata={meta} />;
  }, []);

  const handleUpdateConfig = (contents: any) => {
    void (async () => {
      try {
        const updated = await service.update(_setting!.id, { contents });
        await setSetting(updated);
      } catch {
        // TODO:  Error Handling
      }
    });
  };

  return (
    <ZStack className="ZRomulatorSettingPage-root" gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      <ZForm value={_setting?.contents} onValueChange={handleUpdateConfig}>
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
            suffix: (
              <ZStack
                orientation={ZOrientation.Horizontal}
                gap={ZSizeFixed.Medium}
              >
                <ZFormButton
                  type="reset"
                  ButtonProps={{
                    label: (
                      <ZIconFontAwesome name="rotate-left" tooltip="Reset" />
                    ),
                  }}
                />
                <ZFormButton
                  type="submit"
                  ButtonProps={{
                    label: <ZIconFontAwesome name="save" tooltip="Save" />,
                  }}
                />
              </ZStack>
            ),
          }}
        >
          <ZSuspenseProgress disabled={!isStateLoading(setting)} />
          {metadata.map(renderField)}
        </ZCard>
      </ZForm>
    </ZStack>
  );
}
