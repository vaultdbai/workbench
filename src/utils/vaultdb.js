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

/**
 * 
 * @returns The list if catalogue names 
 */
async function getCataloguesMetaData() {
  try {

    const query = "select * from catalogues";

    const result = await invokeLambdaFunction("fetch-catalogues", query);



    // Parse the JSON results and return it so we can output the list of catalogues.

    let catalogueList = [];

    if (result.Payload) {
      const tableData = JSON.parse(result.Payload);
      if (tableData.data) {
        const data = JSON.parse(tableData.data);
        for (let i in data) {
          console.log(data[i]['catalogueName']);
          catalogueList.push(data[i]['catalogueName']);
        }
      }
    }

    return catalogueList;
  } catch (error) {
    console.error(error);
    return null
  }
}

export { getTablesMetaData, getCataloguesMetaData };
