import Configration from "Configration";
import AWS from 'aws-sdk';

const invokeLambdaFunction = (functionName, payload) => {
  console.log(AWS.config.credentials);
    const lambda = new AWS.Lambda();
    const params = {
      FunctionName: functionName + '-' + Configration.getName(),
      Payload: JSON.stringify(payload),
    };
    return lambda.invoke(params).promise();
  };

export { invokeLambdaFunction };
