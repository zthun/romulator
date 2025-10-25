import {
  useFashionTheme,
  useNavigate,
  ZButton,
  ZCaption,
  ZContentTitle,
  ZDrawer,
  ZH2,
  ZH3,
  ZIconFontAwesome,
  ZList,
  ZListItem,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { ZHorizontalAnchor } from "@zthun/helpful-fn";
import { useMemo, useState } from "react";

export function ZRomulatorMenu() {
  const [expanded, setExpanded] = useState(false);
  const open = useMemo(() => setExpanded.bind(null, true), []);
  const close = useMemo(() => setExpanded.bind(null, false), []);
  const { secondary } = useFashionTheme();
  const navigate = useNavigate();

  const navigateAndClose = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <div className="ZRomulatorMenu-root">
      <ZButton
        name="toggler"
        onClick={open}
        label={<ZIconFontAwesome name="bars" width={ZSizeFixed.ExtraSmall} />}
      />
      <ZDrawer
        name="navigation"
        open={expanded}
        onClose={close}
        anchor={ZHorizontalAnchor.Right}
        fashion={secondary}
        renderHeader={() => (
          <ZContentTitle
            avatar={<ZIconFontAwesome name="bars" />}
            heading={<ZH2 compact>Menu</ZH2>}
            suffix={
              <ZButton
                label={
                  <ZIconFontAwesome
                    name="xmark"
                    width={ZSizeFixed.ExtraSmall}
                  />
                }
                onClick={close}
              />
            }
          />
        )}
      >
        <ZList compact>
          <ZListItem
            name="systems"
            cursor="pointer"
            interactive
            onClick={navigateAndClose.bind(null, "/systems")}
          >
            <ZContentTitle
              avatar={<ZIconFontAwesome name="puzzle-piece" />}
              heading={<ZH3 compact>Systems</ZH3>}
              subHeading={<ZCaption>Your games organized by systems</ZCaption>}
            />
          </ZListItem>

          <ZListItem
            name="games"
            interactive
            cursor="pointer"
            onClick={navigateAndClose.bind(null, "/games")}
          >
            <ZContentTitle
              avatar={<ZIconFontAwesome name="gamepad" />}
              heading={<ZH3 compact>Games</ZH3>}
              subHeading={<ZCaption>View all games</ZCaption>}
            />
          </ZListItem>

          <ZListItem
            name="settings"
            interactive
            cursor="pointer"
            onClick={navigateAndClose.bind(null, "/settings")}
          >
            <ZContentTitle
              avatar={<ZIconFontAwesome name="gear" />}
              heading={<ZH3 compact>Settings</ZH3>}
              subHeading={<ZCaption>Modify configs and options</ZCaption>}
            />
          </ZListItem>
        </ZList>
      </ZDrawer>
    </div>
  );
}
