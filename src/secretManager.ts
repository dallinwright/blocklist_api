// Load the AWS SDK
const AWS = require('aws-sdk');
const secretName = "ES_ENDPOINT";

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
    region: process.env.ES_REGION
});

export async function getESEndpoint() {
    /**
     * Pull the ES endpoint from AWS Secret manager (usually env var, but in a public repo we don't want to expose it)
     * @function getESEndpoint
     * @public
     * @return {string} https endpoint for ES cluster
     */
    const secret = await client.getSecretValue({SecretId: secretName}).promise();
    const secretJSON = JSON.parse(secret.SecretString);
    return secretJSON[secretName];
}


