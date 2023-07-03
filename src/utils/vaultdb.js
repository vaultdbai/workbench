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

  const fileConverter = {
    "CSV File": ".csv",
    "JSON File": ".json",
    "Parquet File": ".parquet",
    "Excel File": ".xlxs"
  }

  try {

    const fileType = fileConverter[typeOfFile];

    let modifiedQueryToExport = "";

    // This only works with CSV files and single line queries that don't end with a semicolon.
    // TODO: Make this function be able to work with any-line query and CSV, JSON, PARQUET, or XLXS file

    modifiedQueryToExport = "COPY (" + queryToExport + ") TO '/mnt/commitlog/output.csv' (HEADER, DELIMITER ',');"

    console.log(modifiedQueryToExport);

    // First execute the COPY query to create an output file
    const result = await invokeLambdaFunction("execute-query", modifiedQueryToExport);
    console.log(result);

    // Then extract the copy query from the file. Make sure to add the file type as a parameter.
    // TODO: Add functionality to include the query execution in export-query lambda function.
    // TODO: Add functionality to retrieve typeOfFile from the client as different files have different tastes.
    // TODO: Handle errors where the file could not be retrieved or the query does not output.
    const result2 = await invokeLambdaFunction("export-query",typeOfFile);
    console.log(result2);

    if (result2.Payload) {
      const tabledata = JSON.parse(result2.Payload);
      console.log(tabledata);

      const fileContent = tabledata.body;
      console.log(fileContent);

      const fileName = "output.csv";
      downloadFile(fileName,fileContent);
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

export { getTablesMetaData, exportQueryResults };
