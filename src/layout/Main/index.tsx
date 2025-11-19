import './index.css';
import {ReactNode, ReactElement} from 'react';

interface LayoutProps {
  children: ReactNode;
}
export default function Main({ children }: LayoutProps): ReactElement {
  return (
    <div id="main">
      {children}
    </div>
  );
}