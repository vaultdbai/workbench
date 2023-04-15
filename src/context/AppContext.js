import React from "react";
import { getTables } from "utils/vaultdb";
/**
 * Context to manage app state
 * Can be replaced with Redux Store
 */
const AppContext = React.createContext(null);

/**
 * Context Provider to wrap component with AppContext
 * giving access to context Data
 */
export const AppContextProvider = ({ children }) => {
  return (
    <AppContext.Provider
      value={{
        tablesData: getTables(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;