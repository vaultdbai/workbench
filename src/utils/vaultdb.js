import { Storage } from "aws-amplify";
import { invokeLambdaFunction } from "utils/lambdaFunctions";
import Configuration from "Configration";

async function getTablesMetaData() {
  try {
    // POST request using fetch with error handling
    const query =
      "select t.table_name, c.column_name from information_schema.tables t, information_schema.columns c where t.table_name=c.table_name";

    const result = await invokeLambdaFunction("execute-query", query, "query");
    console.log("execute-query:", result);
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

async function exportQueryResults(queryToExport, typeOfFile, username) {

  const fileConverter = {
    "CSV File": ".csv",
    "JSON File": ".json",
    "Parquet File": ".parquet",
    "Excel File": ".xlsx"
  }

  try {

    // First only get the last query (the last semicolon statement) 
    //as that is the only query shown on screen
    const listOfStatements = queryToExport.trim().split(";");
    let lastQuery = "";

    for (let i = listOfStatements.length - 1; i >= 0; i--) {
      const statement = listOfStatements[i].trim();
      if (statement !== "") { // we've found our last statement
        lastQuery = statement;
        i = -1;
      }
    }

    const fileSuffix = fileConverter[typeOfFile];

    let modifiedQueryToExport = "";

    if (fileSuffix === ".csv") {
      modifiedQueryToExport = "COPY (" + lastQuery + ") TO '/mnt/commitlog/output.csv' (HEADER, DELIMITER ',');";
    } else if (fileSuffix === ".json") {
      modifiedQueryToExport = "install json;\n"
        + "load json;\n"
        + "COPY (" + lastQuery + ") TO '/mnt/commitlog/output.json';";
    } else if (fileSuffix === ".parquet") {
      modifiedQueryToExport = "COPY (" + lastQuery + ") TO '/mnt/commitlog/output.parquet' (FORMAT PARQUET);";
    } else if (fileSuffix === ".xlsx") {
      modifiedQueryToExport = "install spatial;\n"
        + "load spatial;\n"
        + "COPY (" + lastQuery + ") TO '/mnt/commitlog/output.xlsx' WITH (FORMAT GDAL, DRIVER 'xlsx');";
    }

    console.log(modifiedQueryToExport);

    // Now execute the COPY query to create an output file
    const result = await invokeLambdaFunction("execute-query", modifiedQueryToExport, "query");
    console.log(result);

    // Then extract the copy query from the file. Make sure to add the file type as a parameter.
    // TODO: Handle errors where the file could not be retrieved in AWS Lambda function
    const result2 = await invokeLambdaFunction("export-query", fileSuffix);
    console.log(result2);

    if (result2.Payload) {
      const tabledata = JSON.parse(result2.Payload);
      console.log(tabledata);

      const fileContent = tabledata.body;
      console.log(fileContent);

      const fileName = "output" + fileSuffix;
      downloadFile(fileName, fileContent);

      const uploadedFileName = createUniqueFileName(fileSuffix);

      await Storage.put("users/" + username + "/exported_files/" + uploadedFileName, fileContent);
    }

  } catch (error) {
    console.error(error);
    return null;
  }
}

function downloadFile(fileName, fileContent) {
  // Create a Blob object with the file content
  const blob = new Blob([fileContent], { type: 'text/plain' });

  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Simulate a click on the download link
  link.click();

  // Clean up the URL object after the download starts
  URL.revokeObjectURL(link.href);
}

function createUniqueFileName(fileSuffix) {
  const date = new Date();
  let strToReturn = "";

  console.log(date.getMonth());

  strToReturn += date.getFullYear() + "_"
  strToReturn += (date.getMonth() + 1) + "_" // first month is 0
  strToReturn += date.getDate() + "_"
  strToReturn += date.getHours()
  strToReturn += date.getMinutes()
  strToReturn += date.getSeconds()
  strToReturn += date.getMilliseconds();

  return strToReturn + fileSuffix;
}

/**
 * Fetches the list of catalogue names
 * @returns The list if catalogue names in an array
 */
async function getCataloguesMetaData() {
  try {

    const query = "Get Catalog";

    const result = await invokeLambdaFunction("execute-query", query, "fetch-catalogues");

    // Parse the JSON results and return it so we can output the list of catalogues.

    let catalogueList = [];

    if (result.Payload) {
      const tableData = JSON.parse(result.Payload);
      for (let fileNumber in tableData.data) {
        const filePath = tableData.data[fileNumber]
        const fileName = filePath.split("/").pop();
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

    const result = await invokeLambdaFunction("execute-query", query, "create-catalog");

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export { getTablesMetaData, exportQueryResults, getCataloguesMetaData, addCatalogue };
