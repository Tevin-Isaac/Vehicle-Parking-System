import React, { ReactNode } from 'react';

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

const Container = ({ className, children, ...rest }: ContainerProps) => {
  return (
    <div
      {...rest}
      className={`max-w-[1320px] mx-auto px-5 md:px-10 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
