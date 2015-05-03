'use strict';
var timeline = require('../../app/controllers/timeline.server.controller');
	
module.exports = function(app) {
	
	app.get('/instagrams/search/:insta_query', timeline.findInstagrams);
};
