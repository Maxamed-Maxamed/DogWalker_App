import React, { createContext, useContext, useState } from 'react';

interface SplashScreenContextType {
  isSplashVisible: boolean;
  hideSplash: () => void;
  showSplash: () => void;
}

const SplashScreenContext = createContext<SplashScreenContextType | undefined>(undefined);

export const SplashScreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  const hideSplash = () => {
    setSplashVisible(false);
  };

  const showSplash = () => {
    setSplashVisible(true);
  };

  return (
    <SplashScreenContext.Provider value={{ isSplashVisible, hideSplash, showSplash }}>
      {children}
    </SplashScreenContext.Provider>
  );
};

export const useSplashScreen = () => {
  const context = useContext(SplashScreenContext);
  if (!context) {
    throw new Error('useSplashScreen must be used within SplashScreenProvider');
  }
  return context;
};
