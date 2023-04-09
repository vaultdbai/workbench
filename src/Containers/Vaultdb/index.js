import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import EmptyState from "Components/EmptyState";
import QueryEditor from "Components/QueryEditor";
import QueryResultTable from "Components/QueryResultTable";
import useAppContext from "hooks/useAppContext";
import DnsIcon from "@mui/icons-material/Dns";
import { DEFAULT_STRINGS } from "utils/constants/common";
import { invokeLambdaFunction } from "utils/lambdaFunctions";

function BuildRow(row, columns) {
  const rowitem = {};
  var res = columns.map(function (v, i) {
    rowitem[v.name] = row.Row[i].value;
    return i;
  });  
  return rowitem
}

/**
 * VaultDB for SQL
 * Wrapper Container
 * we can have Other Feature Components added to this
 * */
const Vaultdb = () => {
  const { tablesData } = useAppContext();

  const [queryResults, setQueryResults] = useState();
  /**
   * handles running the query selected by user and returns data for the query
   * and updating store/context if required */
  const handleOnQueryRun = useCallback((query) => {

    invokeLambdaFunction('vaultdb-execute-query', query).then((result) => {
        if (result.data) {
          tablesData["result"] = {
              metaData: {
                result,
                columns: result.data.columns
              },
              rows: [],
          };

          result.data.Rows.forEach((row) => {
            tablesData['result'].rows.push(BuildRow(row, result.data.columns));
          });

          setQueryResults(tablesData['result']);
        };
      }).catch((error) => {
        // handle errors
        console.log(error);
      });
  }, [tablesData]);

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
