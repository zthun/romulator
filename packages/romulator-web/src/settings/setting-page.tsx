import { ZBreadcrumbsLocation, ZCard, ZStack } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";

export function ZRomulatorSettingPage() {
  return (
    <ZStack className="ZRomulatorSettingPage-root" gap={ZSizeFixed.Medium}>
      <ZBreadcrumbsLocation />
      <ZCard>Setting</ZCard>
    </ZStack>
  );
}
