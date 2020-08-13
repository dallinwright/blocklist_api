const AWS = require('aws-sdk');
const {Client} = require('@elastic/elasticsearch');

export function initializeESClient(esEndpoint: string): any {
    /**
     * initialize the client connection to the provided es endpoint
     * @function initializeESClient
     * @public
     * @param {string} elasticsearch endpoint
     * @return {any} A success or error api-gateway compatible response.
     */
    if (AWS && AWS.config && AWS.config.credentials) {
        const accessKeyId = AWS.config.credentials.accessKeyId;
        const secretAccessKey = AWS.config.credentials.secretAccessKey;

        return new Client({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            service: 'es',
            region: process.env.ES_REGION,
            node: esEndpoint
        });
    } else {
        throw new Error('Could not initialize AWS ES client');
    }
}

export function buildIndexName(date: Date): string {
    /**
     * initialize the client connection to the provided es endpoint
     * @function buildIndexName
     * @public
     * @param {Date} date to construct index name with
     * @return {any} index name with date in yyyy-mm-dd
     */

    const prettyDate = date.getFullYear().toString() + "-" +
        ((date.getMonth() + 1).toString().length == 2 ? (date.getMonth() + 1).toString() : "0" +
            (date.getMonth() + 1).toString()) + "-" +
        (date.getDate().toString().length == 2 ? date.getDate().toString() : "0" +
            date.getDate().toString());

    return process.env.ES_INDEX + '-' + prettyDate;
}

export async function verifyIsSafeIP(client: any, index: string, ip: string): Promise<boolean> {
    console.log('SEARCHING INDEX: ' + index);
    const query = {
        query: {
            query_string: {
                query: ip,
            }
        }
    };

    console.log('Query');
    console.log(query);

    try {
        const response = await client.search({
            index: index,
            body: query
        });

        // ES Stores results embedded in large amounts of metadata at this location.
        const hits = response['body']['hits']['hits'];
        console.log('ES hits');
        console.log(hits);
        return hits.length <= 0;
    } catch (error) {
        throw new Error(error.message);
    }
}
