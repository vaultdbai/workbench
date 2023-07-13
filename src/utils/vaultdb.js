import { invokeLambdaFunction } from "utils/lambdaFunctions";
import Configuration from "Configration";

async function getTablesMetaData() {
  try {
    // POST request using fetch with error handling
    const query =
      "select t.table_name, c.column_name from information_schema.tables t, information_schema.columns c where t.table_name=c.table_name";

    const result = await invokeLambdaFunction("execute-query", query, "query");
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
 * Fetches the list of catalogue names
 * @returns The list if catalogue names in an array
 */
async function getCataloguesMetaData() {
  try {

    const query = "";

    const result = await invokeLambdaFunction("execute-query", query, "get-catalogues");

    // Parse the JSON results and return it so we can output the list of catalogues.

    let catalogueList = [];

    if (result.Payload) {
      const tableData = JSON.parse(result.Payload);
      for (let fileNumber in tableData) {
        const fileName = tableData[fileNumber]
        catalogueList.push(fileName.split(".")[0])
      }
    }

    return catalogueList;
  } catch (error) {
    console.error(error);
    return null
  }
}

async function addCatalogue(catalogueName) {
  try {

    const query = "";

    Configuration.setCatalog(catalogueName);

    const result = await invokeLambdaFunction("execute-query", query, "query");

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export { getTablesMetaData, getCataloguesMetaData, addCatalogue};
