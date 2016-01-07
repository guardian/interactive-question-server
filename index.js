var koa = require('koa');
var koaBody = require('koa-body');
var app = koa();

var db = require('./src/db.js');

app.use(koaBody());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function *(next){
	if (this.method === "POST") {
		if (this.request.body.answers) {
			db.saveAnswers(this.request.query.key || 'answers', this.request.body.answers).then(next)
			this.body = 'success\n';
		} else {
			this.status = 500;
			this.body = 'error';
		}
	} else {
		this.status = 404;
		this.body = 'Not found';
	}
});

app.listen(3000);
