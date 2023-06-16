import Configration from "Configration";
import AWS from "aws-sdk";

// TODO: Add database name as a parameter
const invokeLambdaFunction = (functionName, query) => {
  const payload = {
    token: Configration.getToken(),
    payload: query,
    catalog: Configration.getCatalog(),
    database: Configration.getSchema(), // TODO: Then add database name into here.
  };

  const lambda = new AWS.Lambda();
  const params = {
    FunctionName: Configration.getName() + "-" + functionName,
    Payload: JSON.stringify(payload),
  };
  return lambda.invoke(params).promise();
};

export { invokeLambdaFunction };
