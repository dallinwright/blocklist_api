import {APIGatewayEvent, APIGatewayProxyResultV2, Handler} from 'aws-lambda';
import {getESEndpoint} from "./secretManager";
import {buildIndexName, initializeESClient, verifyIsSafeIP} from "./elasticsearch";

export function createResponse(statusCode: number, status: boolean): APIGatewayProxyResultV2 {
    /**
     * Create API Gateway formatted response, useful even if not using api gateway
     * @function createResponse
     * @public
     * @param  {number} statusCode HTTP Status Code
     * @param {body} JSON Event response body
     * @return {any} API Gateway formatted JSON response
     */
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            safeIP: status
        })
    }
}

function determineIP(event: APIGatewayEvent): string {
    if (event.queryStringParameters && event.queryStringParameters.ip) {
        return event.queryStringParameters.ip
    } else {
        const ipRaw = event.headers["X-Forwarded-For"];
        const ipArr = ipRaw.split(',');
        // The leftmost, or position 0, item is the original client IP.
        return ipArr[0];
    }
}

export const handler: Handler = async (event: APIGatewayEvent) => {
    /**
     * AWS Lambda handler
     * @function handler
     * @public
     * @return {any} A success or error api-gateway compatible response.
     */

    try {
        const sourceIP = determineIP(event);
        console.log('Checking IP ' + sourceIP);

        const esEndpoint = await getESEndpoint();
        console.log('Connecting to ES');

        const today = new Date();
        const esClient = await initializeESClient(esEndpoint);
        const esIndex = buildIndexName(today);

        const isSafeIP = await verifyIsSafeIP(esClient, esIndex, sourceIP);

        if (isSafeIP) {
            return createResponse(200, isSafeIP);
        } else {
            return createResponse(403, isSafeIP);
        }
    } catch (e) {
        return createResponse(503, e.message);
    }
};
