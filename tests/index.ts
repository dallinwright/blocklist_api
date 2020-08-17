import {createResponse, determineIP} from "../src";
import {expect} from 'chai';
import chai = require('chai');
import {APIGatewayEvent} from "aws-lambda";

chai.use(require('chai-as-promised'))

describe('Lambda Handler Tests', () => {
    describe('Create a true response', () => {
        it('Should be true',  () => {
            const testResponse =  {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    safeIP: true,
                    sourceIP: '1.1.1.1'
                })
            }

            const response = createResponse(200, true, '1.1.1.1');
            expect(response).to.deep.equal(testResponse);
        })
    });

    describe('Should return an ip from an event', () => {
        it('Should be 1.1.1.1', () => {
            const obj: APIGatewayEvent = {
                resource: '',
                isBase64Encoded: false,
                // @ts-ignore
                requestContext: {
                    "resourceId": "t37fw4",
                    "resourcePath": "/check",
                    "httpMethod": "POST",
                    "extendedRequestId": "RJp50GaZDoEFUgg=",
                    "requestTime": "12/Aug/2020:09:57:31 +0000",
                    "path": "/dev/check",
                    "accountId": "258662911420",
                    "protocol": "HTTP/1.1",
                    "stage": "dev",
                    "domainPrefix": "1sahc75626",
                    "requestTimeEpoch": 1597226251559,
                    "requestId": "b7443bab-fc74-4b97-a5c9-8186f6e3c348"
                },
                body: '',
                path: '',
                pathParameters: null,
                headers: {},
                multiValueHeaders: {},
                stageVariables: null,
                multiValueQueryStringParameters: null,
                httpMethod: 'POST',
                queryStringParameters: {
                    'ip': '1.1.1.1'
                }
            }

            const sourceIP = determineIP(obj);
            expect(sourceIP).to.equal('1.1.1.1');
        })
    });
});
