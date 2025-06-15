import { ZButton, ZDrawer, ZIconFontAwesome } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { ZHorizontalAnchor } from "@zthun/helpful-fn";
import { useMemo, useState } from "react";

export function ZRomulatorMenu() {
  const [expanded, setExpanded] = useState(false);
  const open = useMemo(() => setExpanded.bind(null, true), []);
  const close = useMemo(() => setExpanded.bind(null, false), []);

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
      />
    </div>
  );
}
