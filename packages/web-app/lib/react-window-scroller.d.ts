declare module "react-window-scroller" {
  import { Ref, CSSProperties, ComponentType } from "react";
  import { ListOnScrollProps } from "react-window";
  export type ReactWindowScrollerProps = {
    /** Render props function called with 4 props: `ref`, `outerRef`, `style` and `onScroll` */
    children: ({
      ref,
      outerRef,
      style,
      onScroll,
    }: {
      ref: Ref;
      outerRef: Ref;
      style: CSSProperties;
      onScroll: (props: ListOnScrollProps) => any;
    }) => React.ReactNode;
    /** Timing (ms) for the throttle on window scroll event handler */
    throttleTime?: number;
    /** Set to true if rendering a react-window Grid component (FixedSizeGrid or VariableSizeGrid) */
    isGrid?: boolean;
  };

  export const ReactWindowScroller: ComponentType<ReactWindowScrollerProps> = () => {};
}
