import {
  useFashionTheme,
  useParams,
  ZAlert,
  ZBreadcrumbsLocation,
  ZStack,
  ZSuspenseProgress,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { cssJoinDefined, firstDefined } from "@zthun/helpful-fn";
import { isStateErrored, isStateLoading } from "@zthun/helpful-react";
import { ZRomulatorSystemCard } from "./system-avatar-card";
import { useSystem } from "./systems-service.mjs";

export function ZRomulatorSystemPage() {
  const { id } = useParams();
  const { error } = useFashionTheme();
  const [system] = useSystem(firstDefined("", id));

  const renderSystemInformation = () => {
    if (isStateLoading(system)) {
      return <ZSuspenseProgress height={ZSizeFixed.Large} />;
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

    return <ZRomulatorSystemCard system={system} />;
  };

  return (
    <ZStack
      gap={ZSizeFixed.Medium}
      className={cssJoinDefined("ZRomulatorSystemPage-root")}
    >
      <ZBreadcrumbsLocation />

      {renderSystemInformation()}
    </ZStack>
  );
}
