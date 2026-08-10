import {
  ZBannerMain,
  ZFashionThemeContext,
  ZNavigate,
  ZNotFound,
  ZRoute,
  ZRouteMap,
} from "@zthun/fashion-boutique";
import theme from "@zthun/fashion-theme-dark";

import { ZRomulatorGamePage } from "../games/game-page.js";
import { ZRomulatorGamesPage } from "../games/games-page.js";
import { ZRomulatorJobsPage } from "../jobs/jobs-page.js";
import { ZRomulatorMenu } from "../menu/menu.js";
import { ZRomulatorSettingPage } from "../settings/setting-page.js";
import { ZRomulatorSettingsPage } from "../settings/settings-page.js";
import { ZRomulatorSystemPage } from "../systems/system-page.js";
import { ZRomulatorSystemsPage } from "../systems/systems-page.js";
import { ZRomulatorAvatar } from "./app-avatar.js";
import { ZRomulatorTitle } from "./app-title.js";

export function ZRomulatorApp() {
  return (
    <ZFashionThemeContext value={theme}>
      <ZBannerMain
        TitleProps={{
          avatar: <ZRomulatorAvatar />,
          prefix: <ZRomulatorTitle />,
          suffix: <ZRomulatorMenu />,
        }}
      >
        <ZRouteMap>
          <ZRoute path="/settings" element={<ZRomulatorSettingsPage />} />
          <ZRoute path="/settings/:id" element={<ZRomulatorSettingPage />} />
          <ZRoute path="/systems" element={<ZRomulatorSystemsPage />} />
          <ZRoute path="/systems/:id" element={<ZRomulatorSystemPage />} />
          <ZRoute path="/games" element={<ZRomulatorGamesPage />} />
          <ZRoute path="/games/:id" element={<ZRomulatorGamePage />} />
          <ZRoute path="/jobs" element={<ZRomulatorJobsPage />} />
          <ZRoute path="" element={<ZNavigate to="/systems" />} />
          <ZRoute path="*" element={<ZNotFound />} />
        </ZRouteMap>
      </ZBannerMain>
    </ZFashionThemeContext>
  );
}
