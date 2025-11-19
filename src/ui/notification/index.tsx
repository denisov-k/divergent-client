import { ReactNode, FC } from 'react';

import './index.css';

interface props {
  children: ReactNode;
}

export const Notification: FC<props> = ({ children }) => {
  return <span className="notification">{children}</span>;
};
