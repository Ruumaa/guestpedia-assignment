import React from 'react';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-xs w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {children}
    </div>
  );
};

export default BaseLayout;
