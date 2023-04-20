import Configration from 'Configration';
import AWS from 'aws-sdk';

const invokeLambdaFunction = (functionName, query) => {
    const payload = {
        token: Configration.getToken(),
        payload: query,
        catalog: Configration.getCatalog(),
        database: Configration.getSchema()
    };

    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: functionName + '-' + Configration.getName(),
        Payload: JSON.stringify(payload)
    };
    return lambda.invoke(params).promise();
};

export { invokeLambdaFunction };
