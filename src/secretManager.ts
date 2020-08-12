// Load the AWS SDK
const AWS = require('aws-sdk');
const secretName = "ES_ENDPOINT";

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
    region: process.env.ES_REGION
});

export async function getESEndpoint() {
    const secret = await client.getSecretValue({SecretId: secretName}).promise();
    const secretJSON = JSON.parse(secret.SecretString);
    return secretJSON[secretName];
}


