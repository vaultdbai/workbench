import { invokeLambdaFunction } from "utils/lambdaFunctions";

async function getTablesMetaData() {
  try {
    // POST request using fetch with error handling
    const query =
      "select t.table_name, c.column_name from information_schema.tables t, information_schema.columns c where t.table_name=c.table_name";

    const result = await invokeLambdaFunction("execute-query", query);
    console.log(result);
    const tableresult = {};
    if (result.Payload) {
      const tabledata = JSON.parse(result.Payload);
      if (tabledata.data) {
        const data = JSON.parse(tabledata.data);
        for (let i in data) {
          var tableName = data[i].table_name;
          var column_name = data[i].column_name;
          if (tableName in tableresult) {
            tableresult[tableName].metaData.columns.push({
              name: column_name,
              type: "varchar",
            });
          } else {
            tableresult[tableName] = {
              metaData: {
                tableName,
                columns: [{ name: column_name, type: "varchar" }],
              },
              rows: [],
            };
          }
        }
      }
    }
    return tableresult;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function exportQueryResults(queryToExport, typeOfFile) {

  try {
    // This only works with CSV files and single line queries that don't end with a semicolon.
    // TODO: Make this function be able to work with any-line query and 
    const modifiedQueryToExport = "COPY (" + queryToExport + ") TO '/tmp/output.csv' (HEADER, DELIMITER ',');"

    console.log(modifiedQueryToExport);

    const result = await invokeLambdaFunction("execute-query", modifiedQueryToExport);

    console.log(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getTablesMetaData, exportQueryResults };
