import React from "react";

export const GlobalContext = React.createContext<{ globalData: GlobalData; setGlobalData: (data: GlobalData) => void }>({
  globalData: { identity: '', token: '' },
  setGlobalData: () => { },
});


export interface GlobalData {
  identity: string;
  token: string;
}

export const initGlobalData = { identity: '', token: '' }