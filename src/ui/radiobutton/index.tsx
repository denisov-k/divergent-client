import { useState, useEffect, FC } from 'react';

import './index.css';

interface RadioButtonProps {
  onClick?: (isToggled: boolean) => void;
  value?: boolean;
}

export const RadioButton: FC<RadioButtonProps> = ({ onClick, value }) => {
  const [isToggled, setIsToggled] = useState<boolean | undefined>(value);

  // Синхронизируем внутреннее состояние, если проп value меняется извне
  useEffect(() => {
    if (typeof value === 'boolean') {
      setIsToggled(value);
    }
  }, [value]);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
    if (onClick) {
      onClick(!isToggled);
    }
  };
  return (
    <div
      onClick={handleToggle}
      className='radio-button'
    >
      <div
        className={`absolute top-[50%] transform -translate-y-1/2 w-5 h-5 bg-white rounded-full transition-transform duration-300 border-[1px] border-[#FFDE97] ${
          isToggled ? 'translate-x-6' : '-translate-x-2'
        }`}
      />
    </div>
  );
};
