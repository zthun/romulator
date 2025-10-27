import type {
  IZComponentFashion,
  IZComponentHierarchy,
  IZComponentName,
  IZComponentStyle,
} from "@zthun/fashion-boutique";
import { useFashionTheme, ZBox } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { cssJoinDefined, pickDataAttributes } from "@zthun/helpful-fn";
import { useKeyboardActivate } from "@zthun/helpful-react";
import type { KeyboardEvent, MouseEvent } from "react";

/**
 * Properties for the tile component.
 *
 * A tile is just an alias for an interactive
 * box. Tiles normally go on top of a card.
 */
export interface IZTile
  extends IZComponentHierarchy,
    IZComponentFashion,
    IZComponentStyle,
    IZComponentName {
  /**
   * Occurs when the tile is clicked, or the focus
   * is acquired and the user presses the space or
   * enter key.
   */
  onActivate?: () => void;
}

export function ZTile(props: IZTile) {
  const { component } = useFashionTheme();
  const {
    className,
    fashion = component,
    children,
    name,
    onActivate,
    ...rest
  } = props;

  const handleActivate = (e: MouseEvent | KeyboardEvent) => {
    e.preventDefault();

    onActivate?.call(null);
  };

  const { onKey } = useKeyboardActivate(handleActivate);

  return (
    <ZBox
      className={cssJoinDefined("ZTile-root", className)}
      fashion={fashion}
      interactive
      cursor="pointer"
      padding={ZSizeFixed.Small}
      onClick={handleActivate}
      onKeyDown={onKey}
      {...pickDataAttributes(rest)}
      data-name={name}
    >
      {children}
    </ZBox>
  );
}
