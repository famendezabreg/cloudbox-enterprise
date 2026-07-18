const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

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
    const body = JSON.parse(event.body);

    const existing = await docClient.send(
        new GetCommand({
            TableName: "Files",
            Key: { fileId }
        })
    );

    if (!existing.Item || existing.Item.ownerId !== ownerId) {
        return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Forbidden" })
        };
    }

    const result = await docClient.send(
        new UpdateCommand({
            TableName: "Files",
            Key: { fileId },
            UpdateExpression: "SET fileName = :fileName, category = :category, #s = :size",
            ExpressionAttributeNames: { "#s": "size" },
            ExpressionAttributeValues: {
                ":fileName": body.fileName ?? existing.Item.fileName,
                ":category": body.category ?? existing.Item.category,
                ":size": body.size ?? existing.Item.size
            },
            ReturnValues: "ALL_NEW"
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Attributes)
    };
};