const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key",
    "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {
    console.log("Evento recibido");
    console.log(event);

    const claims = event.requestContext.authorizer.claims;
    const ownerId = claims.sub;
    const fileId = event.pathParameters.id;

    const result = await docClient.send(
        new GetCommand({
            TableName: "Files",
            Key: { fileId }
        })
    );

    if (!result.Item || result.Item.ownerId !== ownerId) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Forbidden" })
        };
    }

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Item)
    };
};