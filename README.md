# Blocklist API

![Deploy](https://github.com/dallinwright/blocklist_api/workflows/Deploy/badge.svg)

![Lint and Test](https://github.com/dallinwright/blocklist_api/workflows/Lint%20and%20Test/badge.svg)

The API receives input via two selected options, either by using the HTTP X-Forwarded-For header to determine the original client IP or via an IP specified via a query string parameter.

If an entry exists in ElasticSearch, it means we have it marked as an unsafe IP address and return not safe, otherwise it is marked as safe.

The idea is to have a function that is called in the middle of a user facing workflow so speed is critical to UX.

### Instructions

To use simply send a HTTP POST request to your url in the following format.

`curl -x POST https://<my_endpoint>.eu-west-1.amazonaws.com/dev/validate`

##### Sample Response via Postman

```json
{
    "safeIP": true
}
```

##### Sample curl response
![hit](./screenshots/curl.png)


##### Sample response for an ElasticSearch hit
![hit](./screenshots/es_result.png)

##### Sample response for an ElasticSearch miss
![hit](./screenshots/empty_result.png)
 
### Performance

The performance is really quick, enough to be in a direct customer facing position with minimal impact. For example, the lambda execution takes less than 100 milliseconds to query elasticsearch with hundreds of thousands of records and return the result.

![performance](./screenshots/performance.png)

The overall time requests spend on our infrastructure is minimal, and you can see a detailed breakdown of performance via this X-Ray screenshot.

![performance_2](./screenshots/performance_2.png)
