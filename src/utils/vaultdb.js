import { invokeLambdaFunction } from "utils/lambdaFunctions";

async function getTables(applicationname) {
  try {
    // POST request using fetch with error handling
    const payload = {
      database: "test1",
      query: "select t.table_name, c.column_name from system.tables t, system.columns c where t.table_name=c.table_name"
    };

    const result = await invokeLambdaFunction('vaultdb-execute-query', payload)
    
    console.log(result);

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
      };
    });

    return tableresult;

  } catch (e) {
    return null;
  }
}

export { getTables };
