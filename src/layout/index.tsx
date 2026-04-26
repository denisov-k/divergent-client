import Main from "./Main";
import { ReactElement, ReactNode } from "react";

import "./index.css";

interface LayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Layout({ children, header, footer }: LayoutProps): ReactElement {
  return (
    <div className="layout">
      {header}
      <Main>
        {children}
      </Main>
      {footer}
    </div>
  );
}
