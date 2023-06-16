import { invokeLambdaFunction } from "utils/lambdaFunctions";

// TODO: Incoroporate new parameter of database name
async function getTablesMetaData() {
  try {
    // POST request using fetch with error handling
    const query =
      "select t.table_name, c.column_name from information_schema.tables t, information_schema.columns c where t.table_name=c.table_name";

    // TODO: Add database name here and change the Lambda function as well.
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

export { getTablesMetaData };
