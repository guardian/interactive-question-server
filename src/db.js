var redis = require('redis');
var client = redis.createClient();

client.on("error", function (err) {
    console.error("Error " + err);
});

module.exports.saveAnswers = function(key, json) {
	return new Promise(resolve => {
		var str = JSON.stringify(json);
		client.lpush(key, str).then(val => {
			resolve();
		})
	});
}
