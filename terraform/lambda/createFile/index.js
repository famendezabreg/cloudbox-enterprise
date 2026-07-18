const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { randomUUID } = require("crypto");

const sqsClient = new SQSClient({});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};

exports.handler = async (event) => {
    console.log("Evento recibido");
    console.log(event);

    const body = JSON.parse(event.body);
    const claims = event.requestContext.authorizer.claims;
    const ownerId = claims.sub;

    if (!body.fileName || body.fileName.trim() === "") {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "fileName es obligatorio" })
        };
    }

    if (typeof body.size !== "number" || body.size < 0) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "size debe ser un numero positivo" })
        };
    }

    if (!body.category || body.category.trim() === "") {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "category es obligatorio" })
        };
    }

    const file = {
        fileId: randomUUID(),
        ownerId: ownerId,
        fileName: body.fileName,
        category: body.category,
        size: body.size,
        status: "ACTIVE",
        uploadDate: new Date().toISOString()
    };

    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(file)
        })
    );

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Message queued" })
    };
};