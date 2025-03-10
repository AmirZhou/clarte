'use client';

import { useState, useContext, createContext } from 'react';
import { IPA } from '@/types';

interface IPAContextValue {
  activeIPA: IPA | null;
  setActiveIPA: React.Dispatch<React.SetStateAction<IPA | null>>;
  // what is this?
}

// null vs undefined in IPAContext, which one is better?
const IPAContext = createContext<IPAContextValue | null>(null);

export function IPAProvider({ children }: { children: React.ReactNode }) {
  const [activeIPA, setActiveIPA] = useState<IPA | null>(null);

  return (
    <IPAContext.Provider value={{ activeIPA, setActiveIPA }}>
      {children}
    </IPAContext.Provider>
  );
}

export function useIPA() {
  const context = useContext(IPAContext);
  if (!context) {
    throw new Error('useIPA must be used within an IPAProvider');
  }
  return context;
}
