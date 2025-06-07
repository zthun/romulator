import {
  ZBannerMain,
  ZFashionThemeContext,
  ZNavigate,
  ZNotFound,
  ZRoute,
  ZRouteMap,
} from "@zthun/fashion-boutique";
import { createDarkTheme } from "@zthun/fashion-theme";
import { ZRomulatorSettingsPage } from "../settings/settings-page.js";
import { ZRomulatorSystemPage } from "../systems/system-page.js";
import { ZRomulatorSystemsPage } from "../systems/systems-page.js";
import { ZRomulatorAvatar } from "./app-avatar.js";
import { ZRomulatorTitle } from "./app-title.js";

const FashionTheme = createDarkTheme();

export function ZRomulatorApp() {
  return (
    <ZFashionThemeContext.Provider value={FashionTheme}>
      <ZBannerMain
        TitleProps={{
          avatar: <ZRomulatorAvatar />,
          prefix: <ZRomulatorTitle />,
        }}
      >
        <ZRouteMap>
          <ZRoute path="/settings" element={<ZRomulatorSettingsPage />} />
          <ZRoute path="/systems" element={<ZRomulatorSystemsPage />} />
          <ZRoute path="/systems/:id" element={<ZRomulatorSystemPage />} />
          <ZRoute path="" element={<ZNavigate to="/systems" />} />
          <ZRoute path="*" element={<ZNotFound />} />
        </ZRouteMap>
      </ZBannerMain>
    </ZFashionThemeContext.Provider>
  );
}
