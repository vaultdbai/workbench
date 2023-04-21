import { invokeLambdaFunction } from "utils/lambdaFunctions";

async function getTablesMetaData() {
  try {
    // POST request using fetch with error handling
    const query =
      "select t.table_name, c.column_name from information_schema.tables t, information_schema.columns c where t.table_name=c.table_name";

    const result = await invokeLambdaFunction("vaultdb-execute-query", query);

    const tableresult = {};
    if (result.Payload) {
      const tabledata = JSON.parse(result.Payload);
      if (tabledata.data) {
        const data = JSON.parse(tabledata.data);
        for (var i = 0; i < data.length; i++) {
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

export { getTablesMetaData };
