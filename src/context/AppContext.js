import React, { useState } from "react";
import { invokeLambdaFunction } from "utils/lambdaFunctions";

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

  const [tableSchema, SetTableSchema] = useState({});
  
  const query = "select t.table_name, c.column_name from information_schema.tables t, information_schema.columns c where t.table_name=c.table_name";

  invokeLambdaFunction('vaultdb-execute-query', query ).then((result) => {
    console.log("got results:", result)
    if (result.data) {
      const tableresult = {};
      result.data.Rows.forEach((row) => {
        const tableName = row.Row[0].value;
        if (tableName in tableresult) {
          tableresult[tableName].metaData.columns.push({ name: row.Row[1].value, type: 'varchar' });
        } else {
          tableresult[tableName] = {
            metaData: {
              tableName,
              columns: [{ name: row.Row[1].value, type: 'varchar' }]
            },
              rows: [],
            };
        }
      });      
      SetTableSchema(tableresult);
    }
  }).catch((error) => {
    // handle errors
    console.error(error);
  });

  return (
    <AppContext.Provider
      value={{
        tablesData: tableSchema
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
