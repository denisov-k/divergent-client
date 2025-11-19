import { FC, ReactNode } from 'react';

import './index.css';

  interface ShadowContainerProps {
    children: ReactNode;
  }

export const ShadowContainer: FC<ShadowContainerProps> = ({ children }) => {
  return <div className='shadow-container'>
    <div className='shadow-container-inner'>
      {children}
    </div>
  </div>
};
