const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log("Evento recibido");
    console.log(event);

    for (const record of event.Records) {
        const body = JSON.parse(record.body);

        await docClient.send(
            new PutCommand({
                TableName: process.env.TABLE_NAME,
                Item: body
            })
        );

        console.log("Documento guardado en DynamoDB:", body.fileId);
    }

    return {
        statusCode: 200
    };
};