
import Main from './Main';
import {ReactNode, ReactElement} from 'react';
import './index.css';
import WebApp from "@twa-dev/sdk";


interface LayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}


export default function Layout({ children, header, footer }: LayoutProps): ReactElement {
  return (
    <div className={"layout" + (WebApp.isFullscreen ? " fullscreen" : "") }>
      {header}
      <Main>
        {children}
      </Main>
      {footer}
    </div>
  );
}
