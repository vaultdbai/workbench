import React from "react";

/**
 * Context to manage app state
 * Can be replaced with Redux Store
 */
const AppContext = React.createContext(null);

export const AppContextProvider = AppContext.Provider;

export default AppContext;
