import Main from "./Main";
import { ReactElement, ReactNode } from "react";

import "./index.css";
import { isTelegramFullscreen } from "@/platform/telegram";

interface LayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Layout({ children, header, footer }: LayoutProps): ReactElement {
  return (
    <div className={"layout" + (isTelegramFullscreen() ? " fullscreen" : "")}>
      {header}
      <Main>
        {children}
      </Main>
      {footer}
    </div>
  );
}
