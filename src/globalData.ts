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

export const IdTable = new Map([
  ['超级管理员', 3],
  ['赞助商', 2],
  ['管理员', 1]
])