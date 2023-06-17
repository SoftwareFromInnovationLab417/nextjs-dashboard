import React from "react";

export const GlobalContext = React.createContext<{ globalData: GlobalData; setGlobalData: (data: GlobalData) => void }>({
  globalData: { identity: '', token: '', id: '' },
  setGlobalData: () => { },
});


export interface GlobalData {
  identity: string;
  token: string;
  id: string
}

export const initGlobalData = { identity: '', token: '', id: '' }