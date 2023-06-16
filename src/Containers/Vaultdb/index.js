import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import EmptyState from "Components/EmptyState";
import QueryEditor from "Components/QueryEditor";
import QueryResultTable from "Components/QueryResultTable";
import DnsIcon from "@mui/icons-material/Dns";
import { DEFAULT_STRINGS } from "utils/constants/common";
import { invokeLambdaFunction } from "utils/lambdaFunctions";

/**
 * VaultDB for SQL
 * Wrapper Container
 * we can have Other Feature Components added to this
 * */
const Vaultdb = () => {
  const [queryResults, setQueryResults] = useState();
  /**
   * handles running the query selected by user and returns data for the query
   * and updating store/context if required */
  const handleOnQueryRun = useCallback(async (query) => {
    try {
      const result = await invokeLambdaFunction("execute-query", query);
      console.log(result);
      if (result.Payload) {
        const tableresult = {};
        tableresult["result"] = {
          metaData: {
            result,
            columns: [],
          },
          rows: [],
        };
        const tabledata = JSON.parse(result.Payload);
        if (tabledata.data) {
          const data = JSON.parse(tabledata.data);
          console.log(data);
          for (let i in data) {
            const rowitem = {};
            for (let [column_name, column_value] of Object.entries(data[i])) {
              if (i === 0) {
                tableresult["result"].metaData.columns.push({
                  name: column_name,
                  type: "varchar",
                });
              }
              rowitem[column_name] = column_value;
            }
            tableresult["result"].rows.push(rowitem);
          }
        }
        setQueryResults(tableresult["result"]);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Box display="flex" height="100%" width="100%" flexDirection="column">
      <QueryEditor onRunQuery={handleOnQueryRun} />
      {!queryResults ? (
        <EmptyState
          icon={<DnsIcon fontSize="large" />}
          title={DEFAULT_STRINGS.WELCOME_MESSAGE_TITLE}
          subtitle={DEFAULT_STRINGS.WELCOME_MESSAGE_SUBTITLE}
        />
      ) : (
        <QueryResultTable tableData={queryResults} />
      )}
    </Box>
  );
};

export default Vaultdb;
