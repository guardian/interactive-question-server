var redis = require('redis');
var AWS = require('aws-sdk')
var _ = require('lodash');

var client = redis.createClient();
var s3 = new AWS.S3();

var key = process.argv[2];
client.lrange(key, 0, -1, (err, items) => {
    var averages = _(items)
        .map(item => JSON.parse(item))
        .flatten()
        .groupBy('q')
        .mapValues((qValues, qId) => {
            return {
                'q': qValues[0].q,
                'avg': qValues.reduce((t, v) => t + v.v, 0) / qValues.length,
                'count': qValues.length
            };
        })
        .values()
        .value();

    s3.putObject({
        'Bucket': 'gdn-cdn',
        'Key': '2016/01/nhs-quiz/averages.json',
        'CacheControl': 'max-age=30',
        'ContentType': 'application/json',
        'ACL': 'public-read',
        'Body': JSON.stringify(averages)
    }, function (err, data) {
        console.log(new Date(), err, data);
        process.exit();
    });
});
