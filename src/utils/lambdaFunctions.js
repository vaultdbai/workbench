import Configration from "Configration";
import AWS from "aws-sdk";

const invokeLambdaFunction = (functionName, query, eventType) => {
  const payload = {
    token: Configration.getToken(),
    payload: query,
    catalog: Configration.getCatalog(),
    database: Configration.getSchema(),
    eventType: eventType
  };

  const lambda = new AWS.Lambda();
  const params = {
    FunctionName: Configration.getName() + "-" + functionName,
    Payload: JSON.stringify(payload),
  };
  return lambda.invoke(params).promise();
};

export { invokeLambdaFunction };
