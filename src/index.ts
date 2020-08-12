import {APIGatewayEvent, APIGatewayProxyResultV2, Handler} from 'aws-lambda';

export function createResponse(statusCode: number, body: any): APIGatewayProxyResultV2 {
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
        body: JSON.stringify(body)
    }
}

export const handler: Handler = async (event: APIGatewayEvent) => {
    /**
     * AWS Lambda handler
     * @function handler
     * @public
     * @return {any} A success or error api-gateway compatible response.
     */
    console.log('Beginning aggregator execution');

    try {
        return createResponse(200, event);
    } catch (e) {
        return createResponse(503, e.message);
    }
};
